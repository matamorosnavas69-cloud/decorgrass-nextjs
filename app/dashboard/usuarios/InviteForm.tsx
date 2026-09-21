"use client";

import { useActionState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { ROLES, ROLE_LABELS } from "@/app/lib/rbac";
import { inviteUser, type InviteFormState } from "@/app/lib/actions/users";

const initialState: InviteFormState = {};

export default function InviteForm() {
  const [state, formAction, isPending] = useActionState(inviteUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[14rem] flex-1">
        <label className="label-field">Email</label>
        <input type="email" name="email" required placeholder="persona@empresa.com" className="input-field" />
      </div>
      <div>
        <label className="label-field">Rol</label>
        <select name="role" defaultValue="viewer" className="input-field">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isPending} className="btn-primary py-3 disabled:opacity-60">
        {isPending ? "Enviando..." : "Enviar invitación"}
      </button>
      <div className="sm:basis-full">
        {state.error && (
          <p className="flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
          </p>
        )}
        {state.sent && (
          <p className="flex items-center gap-1.5 text-sm text-brand-primary">
            <Check className="h-4 w-4" /> Invitación enviada a {state.sent}.
          </p>
        )}
      </div>
    </form>
  );
}
