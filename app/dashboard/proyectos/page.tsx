import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/app/lib/queries/projects";

export const metadata: Metadata = { title: "Proyectos — Dashboard" };

export default async function ProyectosAdminPage() {
  const projects = await getAllProjects();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Proyectos</h1>
        <p className="text-stone-500 text-sm mt-1">
          {projects.length} publicados · gestión de portafolio disponible en una próxima iteración
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Proyecto</th>
              <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Categoría</th>
              <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Ubicación</th>
              <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">m²</th>
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
                <td className="px-6 py-3 text-right">
                  <Link href={`/proyectos/${p.slug}`} target="_blank" className="text-brand-primary hover:underline text-xs font-medium">
                    Ver público
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
