import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/app/lib/authz";
import { hasPermission } from "@/app/lib/rbac";
import { Plus } from "lucide-react";
import { prisma } from "@/app/lib/db";
import TogglePublishedButton from "./TogglePublishedButton";

export const metadata: Metadata = { title: "Proyectos — Dashboard" };

export default async function ProyectosAdminPage() {
  const { role } = await requirePermission("projects:read");
  const canWrite = hasPermission(role, "projects:write");
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Proyectos</h1>
          <p className="text-stone-500 text-sm mt-1">{projects.length} en el portafolio</p>
        </div>
        {canWrite && (
          <Link href="/dashboard/proyectos/nuevo" className="btn-primary gap-1.5 py-2.5 text-sm">
            <Plus className="h-4 w-4" /> Añadir proyecto
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {projects.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-stone-400">Todavía no hay proyectos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Proyecto</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Categoría</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Ubicación</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">m²</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-stone-900">{p.title}</td>
                    <td className="px-6 py-3 text-stone-500">{p.category}</td>
                    <td className="px-6 py-3 text-stone-500">{p.location}</td>
                    <td className="px-6 py-3 text-stone-700">{p.metersInstalled}</td>
                    <td className="px-6 py-3">
                      {canWrite ? (
                        <TogglePublishedButton id={p.id} published={p.published} />
                      ) : (
                        <span className="text-xs text-stone-600">{p.published ? "Publicado" : "Borrador"}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right space-x-3">
                      <Link href={`/proyectos/${p.slug}`} target="_blank" className="text-stone-400 hover:underline text-xs">
                        Ver público
                      </Link>
                      {canWrite && (
                        <Link href={`/dashboard/proyectos/${p.id}`} className="text-brand-primary hover:underline text-xs font-medium">
                          Editar
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
