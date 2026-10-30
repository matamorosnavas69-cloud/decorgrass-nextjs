"use client";

import { useState, useTransition } from "react";
import { ROLES, ROLE_LABELS, type Role } from "@/app/lib/rbac";
import { setUserRole } from "@/app/lib/actions/users";

export default function RoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: Role | null;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <select
        value={role ?? "none"}
        disabled={disabled || isPending}
        onChange={(e) => {
          const next = e.target.value;
          setError(null);
          startTransition(async () => {
            const result = await setUserRole(userId, next);
            if (!result.ok) setError(result.error);
          });
        }}
        className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 disabled:opacity-50"
      >
        <option value="none">Sin acceso</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
