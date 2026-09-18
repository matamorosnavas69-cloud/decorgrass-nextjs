"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/app/lib/data";

export default function Testimonials() {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="badge-green mb-3 inline-block">Clientes felices</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-stone-700">
              4.9 / 5 — Más de 200 proyectos
            </span>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-6"
            >
              <div className="mb-3 flex">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-sm text-stone-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-stone-100 pt-4">
                <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                <p className="text-xs text-stone-400">{t.location} · {t.projectType}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
