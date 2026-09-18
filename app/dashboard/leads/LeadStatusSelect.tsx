"use client";

import { useTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { updateLeadStatus } from "@/app/lib/actions/leads";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUOTED", label: "Cotizado" },
  { value: "CLOSED", label: "Cerrado" },
  { value: "LOST", label: "Perdido" },
];

export default function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        startTransition(() => updateLeadStatus(leadId, next));
      }}
      className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
