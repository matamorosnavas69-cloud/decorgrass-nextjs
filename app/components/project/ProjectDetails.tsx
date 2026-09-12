import { MessageCircle, Ruler, Layers, Palette, Clock } from "lucide-react";
import { getWhatsAppContactURL } from "@/app/lib/utils";
import type { Project } from "@/app/lib/data";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const whatsappURL = getWhatsAppContactURL(
    `Hola, vi el proyecto "${project.title}" y me gustaría algo similar para mi espacio.`
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="badge-stone mb-2 inline-block">{project.category}</span>
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{project.title}</h1>
        <p className="mt-1 text-sm text-stone-400">{project.location}</p>
      </div>

      <p className="text-stone-600 leading-relaxed">{project.description}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Ruler, label: "Área instalada", value: `${project.metersInstalled} m²` },
          { icon: Layers, label: "Grama utilizada", value: project.grassUsed },
          { icon: Palette, label: "Color", value: project.grassColor },
          { icon: Clock, label: "Tiempo de instalación", value: project.installationTime },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-stone-50 p-3 text-center">
            <Icon className="mx-auto mb-1 h-4 w-4 text-brand-primary" />
            <p className="text-xs text-stone-400">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-stone-800">{value}</p>
          </div>
        ))}
      </div>

      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp w-full justify-center py-4 text-base"
      >
        <MessageCircle className="h-5 w-5" />
        Quiero algo similar por WhatsApp
      </a>
    </div>
  );
}
