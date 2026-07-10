"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/app/lib/data";
import Link from "next/link";

export default function Process() {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="badge-green mb-3 inline-block">Proceso</span>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Así trabajamos
          </h2>
          <p className="mt-4 text-stone-500">Simple, transparente y sin sorpresas.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-8 left-0 right-0 hidden h-0.5 bg-grass-200 lg:block" style={{ top: "2rem" }} />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-grass">
                  <span className="text-sm font-bold">{step.step}</span>
                </div>
                <h3 className="mb-2 font-semibold text-stone-900">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/cotizador" className="btn-primary gap-2 px-8 py-3.5 text-base">
            Empezar mi proyecto
          </Link>
        </div>
      </div>
    </section>
  );
}
