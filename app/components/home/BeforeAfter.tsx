"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Ruler } from "lucide-react";
import { projects } from "@/app/lib/data";
import { getWhatsAppContactURL } from "@/app/lib/utils";

function BeforeAfterSlider({ project }: { project: (typeof projects)[0] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div
      className="relative h-72 cursor-col-resize select-none overflow-hidden rounded-xl sm:h-80"
      onMouseMove={handleMouseMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* After (base) */}
      <div className="absolute inset-0 bg-grass-200 flex items-center justify-center text-8xl">
        🌿
      </div>
      {/* Label after */}
      <span className="absolute right-3 top-3 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
        Después
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 bg-stone-300 flex items-center justify-center text-8xl overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        🏚️
      </div>
      {/* Label before */}
      <span className="absolute left-3 top-3 rounded-full bg-stone-700 px-3 py-1 text-xs font-semibold text-white">
        Antes
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xs font-bold text-stone-700">⇔</span>
        </div>
      </div>
    </div>
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
            Antes y después
          </h2>
          <p className="mt-4 text-stone-500">
            Arrastra el deslizador para ver la transformación.
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
              <BeforeAfterSlider project={project} />
              <div>
                <h3 className="font-semibold text-stone-900">{project.title}</h3>
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
