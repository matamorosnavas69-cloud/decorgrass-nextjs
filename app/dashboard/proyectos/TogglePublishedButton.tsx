"use client";

import { useTransition } from "react";
import { toggleProjectPublished } from "@/app/lib/actions/projects";

export default function TogglePublishedButton({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleProjectPublished(id))}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-opacity disabled:opacity-50 ${
        published ? "bg-grass-100 text-brand-primary" : "bg-stone-200 text-stone-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-brand-primary" : "bg-stone-400"}`} />
      {published ? "Publicado" : "Oculto"}
    </button>
  );
}
