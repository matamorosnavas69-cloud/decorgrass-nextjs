import type { Metadata } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { requirePermission } from "@/app/lib/authz";
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, hasPermission, parseRole } from "@/app/lib/rbac";
import InviteForm from "./InviteForm";
import RevokeButton from "./RevokeButton";
import RoleSelect from "./RoleSelect";

export const metadata: Metadata = { title: "Usuarios — Dashboard" };

const TH = "text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide";

export default async function UsuariosPage() {
  const { userId: me, role } = await requirePermission("users:read");
  const canManage = hasPermission(role, "users:manage");

  const client = await clerkClient();
  const [{ data: users }, { data: invitations }] = await Promise.all([
    client.users.getUserList({ limit: 100, orderBy: "-created_at" }),
    client.invitations.getInvitationList({ status: "pending" }),
  ]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Usuarios y roles</h1>
        <p className="text-stone-500 text-sm mt-1">
          Quién puede entrar al panel y qué puede hacer. Sin rol no hay acceso.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Roles</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r}>
              <dt className="text-sm font-medium text-stone-800">{ROLE_LABELS[r]}</dt>
              <dd className="text-xs text-stone-500">{ROLE_DESCRIPTIONS[r]}</dd>
            </div>
          ))}
        </dl>
      </div>

      {canManage && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Invitar a una persona</h2>
          <InviteForm />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className={TH}>Persona</th>
                <th className={TH}>Email</th>
                <th className={TH}>Último ingreso</th>
                <th className={TH}>Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => {
                const email = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? "—";
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";
                const isMe = u.id === me;
                return (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-stone-900">
                      {name}
                      {isMe && <span className="ml-2 text-xs font-normal text-stone-400">(tú)</span>}
                    </td>
                    <td className="px-6 py-3 text-stone-600">{email}</td>
                    <td className="px-6 py-3 text-stone-500">
                      {u.lastSignInAt
                        ? new Date(u.lastSignInAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                        : "Nunca"}
                    </td>
                    <td className="px-6 py-3">
                      <RoleSelect userId={u.id} role={parseRole(u.publicMetadata?.role)} disabled={!canManage || isMe} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <h2 className="px-6 pt-5 pb-3 text-sm font-semibold text-stone-900">Invitaciones pendientes</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-stone-100">
              {invitations.map((inv) => {
                const invitedRole = parseRole(inv.publicMetadata?.role);
                return (
                  <tr key={inv.id}>
                    <td className="px-6 py-3 text-stone-800">{inv.emailAddress}</td>
                    <td className="px-6 py-3 text-stone-500">{invitedRole ? ROLE_LABELS[invitedRole] : "Sin rol"}</td>
                    <td className="px-6 py-3 text-right">{canManage && <RevokeButton invitationId={inv.id} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
