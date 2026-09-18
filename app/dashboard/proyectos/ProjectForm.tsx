"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import type { Project as PrismaProject } from "@prisma/client";
import type { ProjectFormState } from "@/app/lib/actions/projects";

type Action = (prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;

export default function ProjectForm({
  project,
  action,
  submitLabel,
}: {
  project?: PrismaProject;
  action: Action;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Título</label>
          <input name="title" defaultValue={project?.title} required className="input-field" />
        </div>
        <div>
          <label className="label-field">Slug (URL)</label>
          <input name="slug" defaultValue={project?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="input-field" />
        </div>
      </div>

      <div>
        <label className="label-field">Descripción</label>
        <textarea name="description" defaultValue={project?.description} required rows={3} className="input-field resize-none" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field">Categoría</label>
          <input name="category" defaultValue={project?.category} required placeholder="Ej: Residencial" className="input-field" />
        </div>
        <div>
          <label className="label-field">Ubicación</label>
          <input name="location" defaultValue={project?.location} required placeholder="Ej: Medellín, Antioquia" className="input-field" />
        </div>
        <div>
          <label className="label-field">Metros instalados</label>
          <input type="number" name="metersInstalled" defaultValue={project?.metersInstalled} required min={0} className="input-field" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Producto/grama usado</label>
          <input name="grassUsed" defaultValue={project?.grassUsed} required placeholder="Ej: Grama Paisajismo 20mm" className="input-field" />
        </div>
        <div>
          <label className="label-field">Color</label>
          <input name="grassColor" defaultValue={project?.grassColor} required placeholder="Ej: Verde natural" className="input-field" />
        </div>
        <div>
          <label className="label-field">Tiempo de instalación</label>
          <input name="installationTime" defaultValue={project?.installationTime} required placeholder="Ej: 3 días" className="input-field" />
        </div>
        <div>
          <label className="label-field">Garantía</label>
          <input name="warranty" defaultValue={project?.warranty} required placeholder="Ej: 3 años" className="input-field" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Logros / beneficios (uno por línea)</label>
          <textarea name="benefits" defaultValue={project?.benefits.join("\n")} rows={4} className="input-field resize-none text-xs" />
        </div>
        <div>
          <label className="label-field">Tags (uno por línea)</label>
          <textarea name="tags" defaultValue={project?.tags.join("\n")} rows={4} className="input-field resize-none text-xs" />
        </div>
        <div>
          <label className="label-field">Fotos &ldquo;antes&rdquo; — una ruta por línea</label>
          <textarea name="beforeImages" defaultValue={project?.beforeImages.join("\n")} rows={3} className="input-field resize-none text-xs font-mono" />
        </div>
        <div>
          <label className="label-field">Fotos &ldquo;después&rdquo; — una ruta por línea</label>
          <textarea name="afterImages" defaultValue={project?.afterImages.join("\n")} rows={3} className="input-field resize-none text-xs font-mono" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="accent-brand-primary" />
        Publicado (visible en /proyectos)
      </label>

      <button type="submit" disabled={isPending} className="btn-primary px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
