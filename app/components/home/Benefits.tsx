"use client";

import { motion } from "framer-motion";
import { benefits } from "@/app/lib/data";

export default function Benefits() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="badge-green mb-3 inline-block">¿Por qué Decorgrass?</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Beneficios que marcan la diferencia
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group rounded-2xl border border-stone-100 bg-stone-50 p-6 transition-all hover:border-grass-200 hover:bg-grass-50 hover:shadow-card"
            >
              <div className="mb-3 text-3xl">{b.icon}</div>
              <h3 className="mb-1.5 font-semibold text-stone-900 group-hover:text-brand-primary transition-colors">
                {b.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
