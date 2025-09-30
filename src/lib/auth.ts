import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import db from "./db";
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
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  );

  stmt.run(sessionId, userId, expiresAt, createdAt);

  return {
    id: sessionId,
    userId,
    expiresAt,
    createdAt,
  };
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const stmt = db.prepare(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > ?"
  );

  const session = stmt.get(sessionId, new Date().toISOString()) as
    | Session
    | undefined;
  return session || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
  stmt.run(sessionId);
}

export async function getUserById(userId: string): Promise<User | null> {
  const stmt = db.prepare(
    "SELECT id, username, email, created_at as createdAt, last_login as lastLogin FROM users WHERE id = ?"
  );

  const user = stmt.get(userId) as User | undefined;
  return user || null;
}

export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | null> {
  const stmt = db.prepare(
    "SELECT id, username, email, created_at as createdAt, last_login as lastLogin, password_hash FROM users WHERE username = ?"
  );

  const user = stmt.get(username) as
    | (User & { password_hash: string })
    | undefined;
  return user || null;
}

export async function updateLastLogin(userId: string): Promise<void> {
  const stmt = db.prepare("UPDATE users SET last_login = ? WHERE id = ?");
  stmt.run(new Date().toISOString(), userId);
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
