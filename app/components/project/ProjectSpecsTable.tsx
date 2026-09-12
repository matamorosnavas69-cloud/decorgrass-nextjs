import type { Project } from "@/app/lib/data";

interface ProjectSpecsTableProps {
  project: Project;
}

export default function ProjectSpecsTable({ project }: ProjectSpecsTableProps) {
  const rows = [
    { label: "Producto", value: project.grassUsed },
    { label: "Área", value: `${project.metersInstalled} m²` },
    { label: "Aplicación", value: project.category },
    { label: "Instalación", value: project.installationTime },
    { label: "Garantía", value: project.warranty },
  ];

  return (
    <section className="section-padding border-t border-stone-100 bg-stone-50">
      <div className="container-max max-w-2xl">
        <h2 className="mb-8 text-2xl font-bold text-stone-900">Detalles del proyecto</h2>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                i !== rows.length - 1 ? "border-b border-stone-100" : ""
              }`}
            >
              <span className="text-stone-500">{row.label}</span>
              <span className="font-medium text-stone-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
