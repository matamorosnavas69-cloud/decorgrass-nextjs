"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

function isVideo(src: string) {
  return /\.(mp4|webm)(?:[?#].*)?$/i.test(src);
}

function getMediaLabel(index: number) {
  if (index === 0) return "Vista principal";
  if (index === 1) return "Vista de perfil";
  if (index === 2) return "Textura";
  return `Vista adicional ${index - 2}`;
}

interface ProductMediaProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  videoControls?: boolean;
  videoAutoPlay?: boolean;
}

function ProductMedia({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  videoControls = false,
  videoAutoPlay = true,
}: ProductMediaProps) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        aria-label={alt}
        className="h-full w-full object-contain"
        controls={videoControls}
        autoPlay={videoAutoPlay && !videoControls}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-contain"
    />
  );
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const zoomButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const safeActive = active < images.length ? active : 0;
  const activeMedia = images[safeActive];
  const activeLabel = getMediaLabel(safeActive);

  useEffect(() => {
    if (!zoom) return;

    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = zoomButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoom(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusTarget?.focus();
    };
  }, [zoom]);

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-grass-50 shadow-sm">
          <div className="relative flex h-80 items-center justify-center sm:h-96">
            {activeMedia ? (
              <ProductMedia
                src={activeMedia}
                alt={`${productName}: ${activeLabel.toLowerCase()}`}
                priority={safeActive === 0}
                videoAutoPlay={!prefersReducedMotion}
              />
            ) : (
              <p className="px-6 text-center text-sm font-medium text-stone-500">
                Imágenes en preparación
              </p>
            )}
          </div>

          {activeMedia && (
            <button
              ref={zoomButtonRef}
              type="button"
              onClick={() => setZoom(true)}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              aria-label={`Ampliar ${activeLabel.toLowerCase()} de ${productName}`}
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
            {activeMedia ? activeLabel : productName}
          </div>
        </div>

        {images.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            aria-label={`Galería de ${productName}`}
          >
            {images.map((src, index) => {
              const label = getMediaLabel(index);
              const selected = safeActive === index;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar ${label.toLowerCase()} de ${productName}`}
                  aria-current={selected ? "true" : undefined}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-grass-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
                    selected
                      ? "ring-2 ring-brand-primary ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <ProductMedia
                    src={src}
                    alt={`${productName}: miniatura de ${label.toLowerCase()}`}
                    sizes="64px"
                    videoAutoPlay={false}
                  />
                  {isVideo(src) && (
                    <span className="absolute inset-x-1 bottom-1 rounded bg-black/65 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      Video
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {zoom && activeMedia && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${activeLabel} de ${productName}`}
              initial={prefersReducedMotion ? false : { scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={prefersReducedMotion ? undefined : { scale: 0.94 }}
              className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-grass-50 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <ProductMedia
                src={activeMedia}
                alt={`${productName}: ${activeLabel.toLowerCase()} ampliada`}
                sizes="(max-width: 1024px) 100vw, 1024px"
                videoControls
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setZoom(false)}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-800 shadow-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                aria-label="Cerrar imagen ampliada"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
