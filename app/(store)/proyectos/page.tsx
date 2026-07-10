import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Ruler, ArrowRight } from "lucide-react";
import { projects } from "@/app/lib/data";
import { getWhatsAppContactURL } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Proyectos Realizados",
  description:
    "Galería de proyectos reales de instalación de grama sintética. Jardines, terrazas, canchas deportivas y más.",
};

export default function ProyectosPage() {
  return (
    <div className="pt-16">
      <div className="bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-max">
          <span className="badge-green mb-3 inline-block">Portafolio</span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Proyectos realizados
          </h1>
          <p className="mt-3 text-stone-500 max-w-xl">
            Más de 200 espacios transformados en Colombia. Cada proyecto es único.
          </p>
        </div>
      </div>

      <div className="container-max section-padding">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="card overflow-hidden group">
              {/* Before/After visual */}
              <div className="grid grid-cols-2 h-56">
                <div className="relative flex items-center justify-center bg-stone-200">
                  <span className="text-7xl">🏚️</span>
                  <span className="absolute top-2 left-2 rounded-full bg-stone-700 px-2 py-0.5 text-xs font-semibold text-white">Antes</span>
                </div>
                <div className="relative flex items-center justify-center bg-grass-100">
                  <span className="text-7xl">🌿</span>
                  <span className="absolute top-2 right-2 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white">Después</span>
                </div>
              </div>
              <div className="p-5">
                <span className="badge-stone mb-2 inline-block">{project.category}</span>
                <h2 className="font-semibold text-stone-900 group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h2>
                <p className="mt-1.5 text-sm text-stone-500">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />{project.metersInstalled} m²
                  </span>
                  <span className="badge-stone">{project.grassUsed}</span>
                </div>
                <a
                  href={getWhatsAppContactURL(`Hola, vi el proyecto "${project.title}" y me gustaría algo similar para mi espacio.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-dark"
                >
                  Quiero algo similar <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-grass-gradient p-8 text-center">
          <h2 className="text-2xl font-bold text-white">¿Tienes un proyecto en mente?</h2>
          <p className="mt-2 text-white/80">Cuéntanos y te ayudamos a hacerlo realidad.</p>
          <Link href="/cotizador" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-brand-primary hover:bg-grass-50">
            Cotizar mi proyecto
          </Link>
        </div>
      </div>
    </div>
  );
}
