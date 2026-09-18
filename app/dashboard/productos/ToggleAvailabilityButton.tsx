"use client";

import { useTransition } from "react";
import { toggleProductAvailability } from "@/app/lib/actions/products";

export default function ToggleAvailabilityButton({ id, available }: { id: string; available: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleProductAvailability(id))}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-opacity disabled:opacity-50 ${
        available ? "bg-grass-100 text-brand-primary" : "bg-stone-200 text-stone-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${available ? "bg-brand-primary" : "bg-stone-400"}`} />
      {available ? "Disponible" : "Agotado"}
    </button>
  );
}
