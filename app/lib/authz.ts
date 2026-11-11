import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasPermission, parseRole, type Permission, type Role } from "@/app/lib/rbac";

export type Actor = { userId: string; role: Role | null };

/** Quién hace la petición, según el token de sesión (sin llamada de red). Null si no hay sesión. */
export async function getActor(): Promise<Actor | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;
  return { userId, role: parseRole(sessionClaims?.metadata?.role) };
}

async function getFreshRole(userId: string): Promise<Role | null> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return parseRole(user.publicMetadata?.role);
}

/**
 * Exige un permiso. Úsalo al inicio de TODA página del panel y de toda Server
 * Action que lea o escriba datos protegidos — el proxy es solo la primera barrera.
 *
 * - Sin sesión → /sign-in. Sin permiso → /acceso-denegado. En ambos casos
 *   `redirect` corta la ejecución, así que ninguna mutación llega a correr.
 * - `fresh: true` lee el rol directo de Clerk en vez del token (que puede tener
 *   hasta ~60 s de antigüedad). Se usa en gestión de usuarios, donde revocar
 *   un acceso debe surtir efecto al instante.
 */
export async function requirePermission(
  permission: Permission,
  options: { fresh?: boolean } = {}
): Promise<{ userId: string; role: Role }> {
  const actor = await getActor();
  if (!actor) redirect("/sign-in");

  const role = options.fresh ? await getFreshRole(actor.userId) : actor.role;
  if (!role || !hasPermission(role, permission)) {
    audit(actor.userId, "authz.denied", { permission, role });
    redirect("/acceso-denegado");
  }

  return { userId: actor.userId, role };
}

/** Exige tener algún rol válido (para páginas comunes a todo el panel, como el resumen). */
export async function requireRole(): Promise<{ userId: string; role: Role }> {
  const actor = await getActor();
  if (!actor) redirect("/sign-in");
  if (!actor.role) redirect("/acceso-denegado");
  return { userId: actor.userId, role: actor.role };
}

/** Registro de auditoría estructurado (una línea JSON por evento) para Vercel Logs o un log drain. */
export function audit(actorId: string, action: string, detail: Record<string, unknown> = {}): void {
  console.info("[audit]", JSON.stringify({ at: new Date().toISOString(), actor: actorId, action, ...detail }));
}
