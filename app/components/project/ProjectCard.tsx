import Link from "next/link";
import { MapPin, Ruler, ArrowRight } from "lucide-react";
import { getWhatsAppContactURL } from "@/app/lib/utils";
import type { Project } from "@/app/lib/data";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card overflow-hidden group">
      <Link href={`/proyectos/${project.slug}`} className="block">
        <div className="relative h-56 bg-grass-100">
          {project.afterImages[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.afterImages[0]}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>
      </Link>
      <div className="p-5">
        <span className="badge-stone mb-2 inline-block">{project.category}</span>
        <Link href={`/proyectos/${project.slug}`}>
          <h3 className="font-semibold text-stone-900 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-stone-500 line-clamp-2">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{project.location}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3 w-3" />{project.metersInstalled} m²
          </span>
          <span className="badge-stone">{project.grassUsed}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/proyectos/${project.slug}`} className="btn-secondary flex-1 py-2 text-xs">
            Ver proyecto
          </Link>
          <a
            href={getWhatsAppContactURL(`Hola, vi el proyecto "${project.title}" y me gustaría algo similar para mi espacio.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 py-2 text-xs"
          >
            Cotizar <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
