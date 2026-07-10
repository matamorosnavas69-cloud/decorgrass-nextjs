"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-grass-gradient px-8 py-16 text-center sm:px-16"
        >
          {/* Decorative circles */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5" />

          <span className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
            🌿 Oferta especial
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            Transforma tu espacio
            <br />
            <span className="text-grass-200">esta semana</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
            Cotiza tu proyecto sin compromiso y recibe asesoría personalizada gratuita.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-primary shadow-xl transition-all hover:bg-grass-50 hover:shadow-2xl"
            >
              Cotizar mi instalación
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Ver catálogo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
