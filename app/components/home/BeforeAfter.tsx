"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Ruler } from "lucide-react";
import { projects } from "@/app/lib/data";
import { getWhatsAppContactURL } from "@/app/lib/utils";

function ProjectPhoto({ project }: { project: (typeof projects)[0] }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="block">
      <div className="relative h-72 overflow-hidden rounded-xl bg-grass-100 sm:h-80">
        {project.afterImages[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.afterImages[0]}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
      </div>
    </Link>
  );
}

export default function BeforeAfter() {
  const featured = projects.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="badge-green mb-3 inline-block">Proyectos reales</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Proyectos instalados
          </h2>
          <p className="mt-4 text-stone-500">
            Espacios reales transformados con grama sintética Decorgrass.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <ProjectPhoto project={project} />
              <div>
                <Link href={`/proyectos/${project.slug}`}>
                  <h3 className="font-semibold text-stone-900 hover:text-brand-primary transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {project.metersInstalled} m²
                  </span>
                  <span className="badge-stone">{project.grassUsed}</span>
                </div>
                <a
                  href={getWhatsAppContactURL(`Hola, vi el proyecto "${project.title}" y me gustaría algo similar.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-dark"
                >
                  Quiero algo similar <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

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
