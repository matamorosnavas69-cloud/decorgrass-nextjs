"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const displayImages = images.length > 0 ? images : Array(4).fill(null);

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl bg-grass-50">
          <div className="flex h-80 items-center justify-center text-9xl sm:h-96">
            🌿
          </div>
          <button
            onClick={() => setZoom(true)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
            aria-label="Ampliar imagen"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
            {productName}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
                active === i
                  ? "ring-2 ring-brand-primary ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex h-full items-center justify-center bg-grass-100 text-2xl">
                🌿
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="flex h-[80vw] max-h-[80vh] w-[80vw] max-w-[80vh] items-center justify-center rounded-2xl bg-grass-50 text-[12rem]"
              onClick={(e) => e.stopPropagation()}
            >
              🌿
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
