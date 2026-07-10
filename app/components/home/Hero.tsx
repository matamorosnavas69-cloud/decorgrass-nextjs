"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ChevronDown, Play } from "lucide-react";
import { getWhatsAppContactURL } from "@/app/lib/utils";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Accent stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-grass-gradient" />

      {/* Content */}
      <div className="container-max relative z-10 px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full bg-grass-400 animate-pulse" />
            Instalación profesional en todo Colombia
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
        >
          Transforma tu espacio
          <br />
          <span className="text-grass-400">con grama sintética</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
        >
          Jardines, terrazas, balcones y canchas deportivas. Grama premium con instalación
          incluida y garantía de hasta 5 años.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/cotizador" className="btn-primary min-w-[200px] text-base px-8 py-4 shadow-2xl">
            Cotizar mi proyecto
          </Link>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white"
          >
            <Play className="h-4 w-4 fill-white" />
            Ver proyectos
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-grass-400">✓</span> Sin contrato mínimo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-grass-400">✓</span> Cotización gratuita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-grass-400">✓</span> Garantía incluida
          </span>
        </motion.div>
      </div>

      {/* WhatsApp floating in hero */}
      <motion.a
        href={getWhatsAppContactURL()}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex"
      >
        <div className="btn-whatsapp gap-2 text-sm px-4 py-2.5 shadow-2xl">
          <MessageCircle className="h-4 w-4" />
          Escríbenos
        </div>
      </motion.a>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 text-white/60" />
      </motion.div>
    </section>
  );
}
