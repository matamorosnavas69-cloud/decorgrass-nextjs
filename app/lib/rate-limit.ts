import { prisma } from "@/app/lib/db";

// Rate limit del login de admin, respaldado en Postgres (no en memoria —
// en Vercel cada invocación puede ser una instancia distinta sin estado
// compartido; Postgres sí lo comparte). Si la base falla al chequear o
// registrar, se falla abierto: un problema de infraestructura no debe
// dejar al único admin sin poder entrar. Vive en un archivo separado de
// auth.ts porque un archivo "use server" solo puede exportar funciones
// async — estas constantes no pueden vivir ahí.
export const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_ATTEMPT_MAX = 5;

export async function isRateLimited(identifier: string): Promise<boolean> {
  try {
    const since = new Date(Date.now() - LOGIN_ATTEMPT_WINDOW_MS);
    const count = await prisma.loginAttempt.count({ where: { identifier, createdAt: { gt: since } } });
    return count >= LOGIN_ATTEMPT_MAX;
  } catch (e) {
    console.error("[rate-limit] check falló, se deja pasar:", e);
    return false;
  }
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({ data: { identifier } });
  } catch (e) {
    console.error("[rate-limit] no se pudo registrar el intento fallido:", e);
  }
}
