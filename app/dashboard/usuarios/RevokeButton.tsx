"use client";

import { useTransition } from "react";
import { revokeInvitation } from "@/app/lib/actions/users";

export default function RevokeButton({ invitationId }: { invitationId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => void (await revokeInvitation(invitationId)))}
      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Revocando..." : "Revocar"}
    </button>
  );
}
