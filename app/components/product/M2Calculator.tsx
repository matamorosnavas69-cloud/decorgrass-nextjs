"use client";

import { useState } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateQuote, formatCOP, buildWhatsAppURL } from "@/app/lib/utils";
import type { GrassProduct } from "@/app/lib/data";

interface M2CalculatorProps {
  product: GrassProduct;
}

export default function M2Calculator({ product }: M2CalculatorProps) {
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [includeInstallation, setIncludeInstallation] = useState(true);

  const m2 =
    parseFloat(width || "0") * parseFloat(length || "0");

  const quote =
    m2 > 0 ? calculateQuote(m2, product.pricePerM2, includeInstallation) : null;

  const whatsappURL = buildWhatsAppURL({
    productName: product.name,
    squareMeters: m2,
    pricePerM2: product.pricePerM2,
    totalPrice: quote?.grandTotal,
    installationNeeded: includeInstallation,
  });

  return (
    <div className="rounded-2xl border border-grass-200 bg-grass-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-brand-primary" />
        <h3 className="font-semibold text-stone-900">Calculadora de m²</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field text-xs">Ancho (m)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Ej: 5"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field text-xs">Largo (m)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Ej: 8"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={includeInstallation}
          onChange={(e) => setIncludeInstallation(e.target.checked)}
          className="accent-brand-primary"
        />
        Incluir instalación profesional
      </label>

      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                Estimado para {m2.toFixed(1)} m²
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Material</span>
                  <span className="font-medium">{formatCOP(quote.materialTotal)}</span>
                </div>
                {quote.installationTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Instalación</span>
                    <span className="font-medium">{formatCOP(quote.installationTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone-100 pt-1.5">
                  <span className="font-semibold text-stone-800">Total estimado</span>
                  <span className="font-bold text-brand-primary text-lg">{formatCOP(quote.grandTotal)}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-400">*Precio orientativo, varía según accesos y preparación del terreno.</p>
            </div>

            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-3 w-full justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Cotizar {m2.toFixed(1)} m² por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
