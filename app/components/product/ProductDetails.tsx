"use client";

import { useState } from "react";
import { Heart, MessageCircle, Check, Shield, Ruler, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP, buildWhatsAppURL } from "@/app/lib/utils";
import { useWishlist } from "@/app/hooks/useWishlist";
import { cn } from "@/app/lib/utils";
import M2Calculator from "./M2Calculator";
import type { GrassProduct } from "@/app/lib/data";

interface ProductDetailsProps {
  product: GrassProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  const [selectedColor, setSelectedColor] = useState(product.availableColors[0] || "");
  const [selectedHeight, setSelectedHeight] = useState(product.availableHeights[0] || "");

  const whatsappURL = buildWhatsAppURL({
    productName: `${product.name} (${selectedHeight}, ${selectedColor})`,
    pricePerM2: product.pricePerM2,
    message: `Me interesa la grama ${product.name}. ¿Pueden darme más información y cotización?`,
  });

  return (
    <div className="space-y-6">
      {/* Name + wishlist */}
      <div className="flex items-start justify-between gap-3">
        <div>
          {product.badge && (
            <span className={cn(
              "badge mb-2",
              product.badgeType === "green" ? "badge-green" :
              product.badgeType === "amber" ? "badge-amber" : "badge-stone"
            )}>
              {product.badge}
            </span>
          )}
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm capitalize text-stone-400">{product.category}</p>
        </div>
        <button
          onClick={() => toggle(product)}
          aria-label={wished ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            wished
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-stone-200 text-stone-400 hover:border-brand-primary hover:text-brand-primary"
          )}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-current")} />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-brand-primary">
          {formatCOP(product.pricePerM2)}
        </span>
        <span className="text-stone-400">/ m²</span>
      </div>

      {/* Description */}
      <p className="text-stone-600 leading-relaxed">{product.description}</p>

      {/* Specs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Ruler, label: "Altura", value: product.fiberHeight },
          { icon: Layers, label: "Densidad", value: product.density },
          { icon: Shield, label: "Garantía", value: product.guarantee },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-stone-50 p-3 text-center">
            <Icon className="mx-auto mb-1 h-4 w-4 text-brand-primary" />
            <p className="text-xs text-stone-400">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-stone-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Color selector */}
      {product.availableColors.length > 1 && (
        <div>
          <p className="label-field">Color: <span className="font-semibold">{selectedColor}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.availableColors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  selectedColor === c
                    ? "border-brand-primary bg-grass-50 text-brand-primary"
                    : "border-stone-200 text-stone-600 hover:border-stone-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Height selector */}
      {product.availableHeights.length > 1 && (
        <div>
          <p className="label-field">Altura de fibra: <span className="font-semibold">{selectedHeight}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.availableHeights.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHeight(h)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  selectedHeight === h
                    ? "border-brand-primary bg-grass-50 text-brand-primary"
                    : "border-stone-200 text-stone-600 hover:border-stone-300"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div>
        <p className="label-field mb-3">Beneficios</p>
        <ul className="space-y-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-stone-700">
              <Check className="h-4 w-4 shrink-0 text-brand-primary" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2">
        {product.petFriendly && <span className="badge-green">🐕 Pet friendly</span>}
        {product.childFriendly && <span className="badge-green">🧒 Apto niños</span>}
        {product.sportSuitable && <span className="badge-stone">⚽ Deportiva</span>}
      </div>

      {/* Calculator */}
      <M2Calculator product={product} />

      {/* Main CTA */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp w-full justify-center py-4 text-base"
      >
        <MessageCircle className="h-5 w-5" />
        Cotizar este producto por WhatsApp
      </a>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-100 bg-white/95 p-3 backdrop-blur-sm md:hidden">
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full justify-center py-3.5"
        >
          <MessageCircle className="h-5 w-5" />
          Cotizar por WhatsApp — {formatCOP(product.pricePerM2)}/m²
        </a>
      </div>
    </div>
  );
}
