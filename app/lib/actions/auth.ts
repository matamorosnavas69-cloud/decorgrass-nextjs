"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/app/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/dashboard");

  const result = await login(email, password);
  if (!result.ok) return { error: result.error ?? "Credenciales inválidas" };

  redirect(from.startsWith("/dashboard") ? from : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/login");
}
