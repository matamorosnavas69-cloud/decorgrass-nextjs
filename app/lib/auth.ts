/**
 * Sesión de admin: JWT firmado en una cookie HttpOnly.
 *
 * No hay tabla de usuarios — un solo admin autenticado contra
 * ADMIN_EMAIL/ADMIN_PASSWORD_HASH (variables de entorno). Si no están
 * configuradas, cae a una credencial de desarrollo para no bloquear el
 * trabajo local (nunca se usa si las variables están presentes).
 */

"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { isRateLimited, recordFailedAttempt } from "@/app/lib/rate-limit";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-secret-replace-in-prod-32-chars"
);
const COOKIE_NAME = "decorgrass-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

// ponytail: admin único vía env vars, sin tabla User — si el negocio necesita
// varias personas con acceso propio, ahí sí se justifica un modelo AdminUser.
const DEV_EMAIL = "admin@decorgrass.com";
const DEV_PASSWORD_HASH = "$2b$10$oXdsZD.6nQ7Gi7UZzQwGF./WzewtnkKMbI67unU7xEKTwfeR01zne"; // "decorgrass2026"

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? DEV_EMAIL).toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? DEV_PASSWORD_HASH;

export type AdminSession = { email: string };
type AuthResult = { ok: boolean; error?: string };

async function setSessionCookie(session: AdminSession): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

/** Lanza si no hay sesión de admin — usar al inicio de toda Server Action de escritura del dashboard. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error("No autorizado");
  return session;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();

  if (await isRateLimited(normalized)) {
    return { ok: false, error: "Demasiados intentos. Espera unos minutos e intenta de nuevo." };
  }

  if (normalized !== ADMIN_EMAIL) {
    await recordFailedAttempt(normalized);
    return { ok: false, error: "Credenciales inválidas" };
  }

  const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!match) {
    await recordFailedAttempt(normalized);
    return { ok: false, error: "Credenciales inválidas" };
  }

  await setSessionCookie({ email: normalized });
  return { ok: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
