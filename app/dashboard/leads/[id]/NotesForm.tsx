"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { updateLeadNotesAction, type NotesFormState } from "@/app/lib/actions/leads";

const initialState: NotesFormState = {};

export default function NotesForm({ leadId, initialNotes }: { leadId: string; initialNotes: string }) {
  const [state, formAction, isPending] = useActionState(updateLeadNotesAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={leadId} />
      <textarea
        name="notes"
        defaultValue={initialNotes}
        rows={5}
        placeholder="Notas internas sobre esta cotización..."
        className="input-field resize-none"
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="btn-secondary py-2 text-sm disabled:opacity-60">
          {isPending ? "Guardando..." : "Guardar notas"}
        </button>
        {state.saved && !isPending && (
          <span className="flex items-center gap-1 text-xs text-brand-primary">
            <Check className="h-3.5 w-3.5" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
