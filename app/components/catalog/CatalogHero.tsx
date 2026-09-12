"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

type HeroMedia = {
  type: "image" | "video";
  src: string;
  title: string;
  description: string;
};

const HERO_MEDIA: HeroMedia[] = [
  {
    type: "image",
    src: "/catalogo/catalogo-hero.png",
    title: "Catálogo de grama sintética Premium",
    description: "Encuentra la grama perfecta para tu espacio.",
  },
  {
    type: "video",
    src: "/catalogo/0910.mp4",
    title: "Déjate llevar por tus sensaciones",
    description: "Siente la textura y el verde natural de nuestra grama en cada paso.",
  },
];

const CERTIFICATIONS: { name: string; description: string }[] = [
  {
    name: "FIFA Quality Concept",
    description:
      "Certifica el rendimiento y la seguridad de la grama para uso deportivo profesional.",
  },
  {
    name: "ASTM",
    description:
      "Normas D1907, D2256, D2859, D3218, D5848 y D789: validan resistencia, inflamabilidad y durabilidad del material.",
  },
  {
    name: "EN",
    description:
      "Normas EN ISO 20105, EN 12616 y EN 13744: solidez del color, drenaje y resistencia al desgaste.",
  },
  {
    name: "ISO",
    description:
      "Normas ISO 2549, ISO 1763 e ISO 4919: calidad, dimensiones y propiedades físicas de la grama.",
  },
  {
    name: "DIN",
    description: "Estándar alemán que certifica la calidad y seguridad de materiales sintéticos.",
  },
  {
    name: "TRACE",
    description: "Certificación de trazabilidad que garantiza el origen y control de calidad del material.",
  },
  {
    name: "SGS",
    description: "Certificación otorgada por SGS, líder mundial en inspección y verificación de calidad.",
  },
];

const NORMAS_LABEL = "Normas verificadas:";

const NORMAS: { code: string; description: string }[] = [
  { code: "ISO 2549", description: "Determina la masa por unidad de superficie de la grama." },
  { code: "ISO 1763", description: "Mide el grosor total del sistema de grama sintética." },
  { code: "ISO 4919", description: "Evalúa la resistencia al desprendimiento de las fibras (pull-out)." },
  { code: "EN ISO 20105", description: "Mide la solidez del color frente a la luz y la intemperie." },
  { code: "EN 12616", description: "Evalúa la velocidad de infiltración de agua (drenaje)." },
  { code: "EN 13744", description: "Simula el desgaste por tráfico peatonal prolongado." },
  { code: "ASTM D1907", description: "Método de conteo de hilos por unidad de longitud en la fibra." },
  { code: "ASTM D2256", description: "Mide la resistencia a la tracción y elongación de la fibra." },
  { code: "ASTM D2859", description: "Prueba de inflamabilidad para alfombras y superficies textiles." },
  { code: "ASTM D3218", description: "Evalúa la resistencia al ensortijado (curling) de la fibra." },
  { code: "ASTM D5848", description: "Mide la resistencia al desgaste por tráfico intenso." },
  { code: "ASTM D789", description: "Determina la viscosidad relativa del polímero utilizado." },
];

export default function CatalogHero() {
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMediaIndex((i) => (i + 1) % HERO_MEDIA.length), 6000);
    return () => clearInterval(id);
  }, []);

  const media = HERO_MEDIA[mediaIndex];

  return (
    <div className="relative flex min-h-[420px] items-center overflow-hidden sm:min-h-[480px]">
      <AnimatePresence mode="wait">
        {media.type === "image" ? (
          <motion.img
            key={media.src}
            src={media.src}
            alt="Catálogo de grama sintética"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <motion.video
            key={media.src}
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {HERO_MEDIA.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setMediaIndex(i)}
            aria-label={`Diapositiva ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === mediaIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="container-max relative px-4 py-12 text-center sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${mediaIndex}`}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            {media.title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${mediaIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-stone-100"
          >
            {media.description}
          </motion.p>
        </AnimatePresence>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-2 text-stone-100"
        >
          Grama 100% importada y respaldada por más de 10 años de experiencia en el mercado.
        </motion.p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: "easeOut" }}
              className="group relative"
            >
              <span
                tabIndex={0}
                className="badge cursor-default gap-1.5 bg-white/90 text-stone-700 backdrop-blur-sm outline-none"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                {cert.name}
              </span>
              <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-lg bg-stone-900 px-3 py-2 text-left text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-stone-900" />
                {cert.description}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-xs text-stone-300">
          <span>
            {NORMAS_LABEL.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01, delay: 1.2 + i * 0.02 }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </span>
          {NORMAS.map((norma, i) => (
            <motion.span
              key={norma.code}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.6 + i * 0.05 }}
              className="group relative"
            >
              <span
                tabIndex={0}
                className="cursor-default rounded-full border border-white/20 bg-white/10 px-2 py-0.5 outline-none hover:bg-white/20 focus:bg-white/20"
              >
                {norma.code}
                {i < NORMAS.length - 1 && ","}
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-lg bg-stone-900 px-3 py-2 text-left text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-stone-900" />
                {norma.description}
              </span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
