"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Ruler } from "lucide-react";
import type { Project } from "@/app/lib/data";
import { getWhatsAppContactURL } from "@/app/lib/utils";

function ProjectPhoto({ project }: { project: Project }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="block">
      <div className="relative h-72 overflow-hidden rounded-xl bg-grass-100 sm:h-80">
        {project.afterImages[0] && (
          <Image
            src={project.afterImages[0]}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
      </div>
    </Link>
  );
}

export default function BeforeAfterGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {projects.map((project, i) => (
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
  );
}
