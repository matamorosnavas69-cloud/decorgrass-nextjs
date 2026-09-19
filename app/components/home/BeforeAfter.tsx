import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProjects } from "@/app/lib/queries/projects";
import BeforeAfterGrid from "@/app/components/home/BeforeAfterGrid";

export default async function BeforeAfter() {
  const projects = await getAllProjects();
  const featured = projects.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="mb-12 text-center">
          <span className="badge-green mb-3 inline-block">Proyectos reales</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Proyectos instalados
          </h2>
          <p className="mt-4 text-stone-500">
            Espacios reales transformados con grama sintética Decorgrass.
          </p>
        </div>

        <BeforeAfterGrid projects={featured} />

        <div className="mt-10 text-center">
          <Link href="/proyectos" className="btn-secondary gap-2">
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
