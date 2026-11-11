"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { audit, requirePermission } from "@/app/lib/authz";
import { parseRole } from "@/app/lib/rbac";
import { SITE_URL } from "@/app/lib/site";

export type UserActionResult = { ok: true } | { ok: false; error: string };
export type InviteFormState = { error?: string; sent?: string };

// Todas estas acciones exigen `users:manage` leyendo el rol en vivo desde Clerk
// (fresh): revocar a alguien debe tener efecto inmediato, no cuando expire su token.

/**
 * Cambia el rol de otra persona. `"none"` le quita todo acceso al panel.
 *
 * Invariante: nadie puede cambiar su propio rol. Como solo un admin llega hasta
 * aquí, quien ejecuta siempre sigue siendo admin después del cambio, así que es
 * imposible dejar el sistema sin administradores (ni auto-escalarse de rol).
 */
export async function setUserRole(targetUserId: string, value: string): Promise<UserActionResult> {
  const actor = await requirePermission("users:manage", { fresh: true });

  const nextRole = value === "none" ? null : parseRole(value);
  if (value !== "none" && nextRole === null) return { ok: false, error: "Rol inválido." };
  if (targetUserId === actor.userId) {
    return { ok: false, error: "No puedes cambiar tu propio rol. Pídeselo a otro administrador." };
  }

  try {
    const client = await clerkClient();
    const target = await client.users.getUser(targetUserId);
    const previousRole = parseRole(target.publicMetadata?.role);
    if (previousRole === nextRole) return { ok: true };

    await client.users.updateUserMetadata(targetUserId, { publicMetadata: { role: nextRole } });
    audit(actor.userId, "user.role_changed", { target: targetUserId, from: previousRole, to: nextRole });
  } catch (e) {
    console.error("[users] setUserRole error:", e);
    return { ok: false, error: "No se pudo cambiar el rol. Intenta de nuevo." };
  }

  revalidatePath("/dashboard/usuarios");
  return { ok: true };
}

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un email válido."),
  role: z.string(),
});

/** Invita por email con el rol ya asignado: Clerk lo copia al usuario cuando acepta. */
export async function inviteUser(_prev: InviteFormState, formData: FormData): Promise<InviteFormState> {
  const actor = await requirePermission("users:manage", { fresh: true });

  const parsed = inviteSchema.safeParse({ email: formData.get("email"), role: formData.get("role") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  const role = parseRole(parsed.data.role);
  if (!role) return { error: "Elige un rol válido." };

  try {
    const client = await clerkClient();
    await client.invitations.createInvitation({
      emailAddress: parsed.data.email,
      publicMetadata: { role },
      // En desarrollo Clerk usa su URL configurada; en producción, el dominio real del sitio.
      ...(process.env.NODE_ENV === "production" ? { redirectUrl: `${SITE_URL}/sign-up` } : {}),
    });
    audit(actor.userId, "user.invited", { email: parsed.data.email, role });
  } catch (e) {
    console.error("[users] inviteUser error:", e);
    return { error: "No se pudo enviar la invitación. Revisa que el email no tenga ya una cuenta o invitación pendiente." };
  }

  revalidatePath("/dashboard/usuarios");
  return { sent: parsed.data.email };
}

export async function revokeInvitation(invitationId: string): Promise<UserActionResult> {
  const actor = await requirePermission("users:manage", { fresh: true });

  try {
    const client = await clerkClient();
    await client.invitations.revokeInvitation(invitationId);
    audit(actor.userId, "invitation.revoked", { invitationId });
  } catch (e) {
    console.error("[users] revokeInvitation error:", e);
    return { ok: false, error: "No se pudo revocar la invitación." };
  }

  revalidatePath("/dashboard/usuarios");
  return { ok: true };
}
