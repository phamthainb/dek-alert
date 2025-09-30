"use server";

import { redirect } from "next/navigation";
import { login as authLogin, logout as authLogout } from "./auth";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  const result = await authLogin(username, password);

  if (result.success) {
    redirect("/");
  }

  return result;
}

export async function logoutAction() {
  await authLogout();
  redirect("/login");
}
