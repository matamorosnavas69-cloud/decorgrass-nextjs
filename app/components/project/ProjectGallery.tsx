"use client";

import { useEffect, useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-grass-50 text-7xl">
        🌿
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-grass-100">
          <button
            onClick={() => setZoom(true)}
            className="block h-full w-full"
            aria-label="Ampliar imagen"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${title} — foto ${active + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
          <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-sm backdrop-blur-sm">
            <ZoomIn className="h-4 w-4" />
          </span>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
                  active === i
                    ? "ring-2 ring-brand-primary ring-offset-1"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <button
              onClick={() => setZoom(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Foto siguiente"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[active]}
                alt={`${title} — foto ${active + 1}`}
                className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
