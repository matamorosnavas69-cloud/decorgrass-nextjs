"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCOP, buildWhatsAppURL } from "@/app/lib/utils";
import { useWishlist } from "@/app/hooks/useWishlist";
import type { GrassProduct } from "@/app/lib/data";

interface ProductCardProps {
  product: GrassProduct;
  index?: number;
}

const badgeStyles = {
  green: "badge-green",
  amber: "badge-amber",
  stone: "badge-stone",
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  const whatsappURL = buildWhatsAppURL({
    productName: product.name,
    pricePerM2: product.pricePerM2,
    message: `Me interesa la grama ${product.name} (${product.fiberHeight}). ¿Podrían cotizarme?`,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <div className="card group relative flex flex-col overflow-hidden">
        {/* Image */}
        <Link href={`/producto/${product.slug}`} className="block">
          <div className="relative h-56 overflow-hidden bg-grass-50">
            <div className="flex h-full items-center justify-center text-7xl transition-transform duration-500 group-hover:scale-110">
              🌿
            </div>

            {/* Badge */}
            {product.badge && (
              <span
                className={cn(
                  "absolute left-3 top-3",
                  badgeStyles[product.badgeType ?? "stone"]
                )}
              >
                {product.badge}
              </span>
            )}

            {/* Pet / Child icons */}
            <div className="absolute right-3 top-3 flex gap-1">
              {product.petFriendly && (
                <span className="badge bg-amber-100 text-amber-700">🐕</span>
              )}
              {product.childFriendly && (
                <span className="badge bg-blue-100 text-blue-700">🧒</span>
              )}
            </div>
          </div>
        </Link>

        {/* Wishlist */}
        <button
          onClick={() => toggle(product)}
          aria-label={wished ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={cn(
            "absolute right-3 bottom-[168px] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110",
            wished ? "text-red-500" : "text-stone-300"
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/producto/${product.slug}`}>
            <h3 className="mb-1 font-semibold text-stone-900 transition-colors group-hover:text-brand-primary">
              {product.name}
            </h3>
          </Link>

          <p className="mb-3 text-xs text-stone-500 leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>

          <div className="mb-4 flex flex-wrap gap-1.5 text-xs">
            <span className="badge-stone">Fibra {product.fiberHeight}</span>
            <span className="badge-stone">Garantía {product.guarantee}</span>
          </div>

          <div className="mt-auto">
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-xl font-bold text-brand-primary">
                {formatCOP(product.pricePerM2)}
              </span>
              <span className="text-xs text-stone-400">/ m²</span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/producto/${product.slug}`}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                Ver detalle
              </Link>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 py-2 text-xs"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Cotizar
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
