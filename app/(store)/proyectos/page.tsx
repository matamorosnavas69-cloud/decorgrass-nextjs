import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/app/lib/queries/projects";
import ProjectCard from "@/app/components/project/ProjectCard";

export const metadata: Metadata = {
  title: "Proyectos Realizados",
  description:
    "Galería de proyectos reales de instalación de grama sintética. Jardines, terrazas, canchas deportivas y más.",
};

export default async function ProyectosPage() {
  const projects = await getAllProjects();

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
            <ProjectCard key={project.id} project={project} />
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
