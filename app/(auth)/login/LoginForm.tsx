"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/lib/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />
      <div>
        <label className="label-field">Email</label>
        <input type="email" name="email" required placeholder="admin@decorgrass.com" className="input-field" autoFocus />
      </div>
      <div>
        <label className="label-field">Contraseña</label>
        <input type="password" name="password" required placeholder="••••••••" className="input-field" />
      </div>

      {state.error && (
        <p className="flex items-center gap-1.5 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
