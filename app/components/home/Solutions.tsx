"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { solutions } from "@/app/lib/data";

export default function Solutions() {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="badge-green mb-3">Soluciones</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            ¿Qué necesitas transformar?
          </h2>
          <p className="mt-4 text-stone-500">
            Tenemos la solución perfecta para cada espacio.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={sol.href} className="group block">
                <div className="card overflow-hidden">
                  <div className="relative h-40 overflow-hidden bg-grass-100">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {sol.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1.5 font-semibold text-stone-900 group-hover:text-brand-primary transition-colors">
                      {sol.title}
                    </h3>
                    <p className="mb-3 text-sm text-stone-500">{sol.description}</p>
                    <span className="flex items-center gap-1 text-sm font-medium text-brand-primary">
                      Ver opciones
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
