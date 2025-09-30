import 'reflect-metadata';
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDataSource } from "./data-source";
import { User as UserEntity, Session as SessionEntity } from "./entities";
import type { Session, User } from "./types";

const SESSION_COOKIE_NAME = "auth-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function createSession(userId: string): Promise<Session> {
  const dataSource = await getDataSource();
  const sessionRepo = dataSource.getRepository(SessionEntity);

  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  const createdAt = new Date().toISOString();

  const session = sessionRepo.create({
    id: sessionId,
    user_id: userId,
    expires_at: expiresAt,
    created_at: createdAt,
  });

  await sessionRepo.save(session);

  return {
    id: sessionId,
    userId,
    expiresAt,
    createdAt,
  };
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const dataSource = await getDataSource();
  const sessionRepo = dataSource.getRepository(SessionEntity);

  const session = await sessionRepo.findOne({
    where: { id: sessionId },
  });

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date(session.expires_at) <= new Date()) {
    await sessionRepo.remove(session);
    return null;
  }

  return {
    id: session.id,
    userId: session.user_id,
    expiresAt: session.expires_at,
    createdAt: session.created_at,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const dataSource = await getDataSource();
  const sessionRepo = dataSource.getRepository(SessionEntity);

  await sessionRepo.delete({ id: sessionId });
}

export async function getUserById(userId: string): Promise<User | null> {
  const dataSource = await getDataSource();
  const userRepo = dataSource.getRepository(UserEntity);

  const user = await userRepo.findOne({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
    lastLogin: user.last_login,
  };
}

export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | null> {
  const dataSource = await getDataSource();
  const userRepo = dataSource.getRepository(UserEntity);

  const user = await userRepo.findOne({
    where: { username },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
    lastLogin: user.last_login,
    password_hash: user.password_hash,
  };
}

export async function updateLastLogin(userId: string): Promise<void> {
  const dataSource = await getDataSource();
  const userRepo = dataSource.getRepository(UserEntity);

  await userRepo.update(
    { id: userId },
    { last_login: new Date().toISOString() }
  );
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

  return getUserById(session.userId);
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: "Invalid username or password" };
    }

    // Create session
    const session = await createSession(user.id);
    await setSessionCookie(session.id);

    // Update last login
    await updateLastLogin(user.id);

    const { password_hash, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  await clearSessionCookie();
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
