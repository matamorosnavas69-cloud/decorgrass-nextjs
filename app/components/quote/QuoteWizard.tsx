"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowLeft, ArrowRight, MessageCircle, Check, Star, Info } from "lucide-react";
import { products, type GrassProduct } from "@/app/lib/data";
import { buildWhatsAppURL, calculateQuote, formatCOP } from "@/app/lib/utils";

const STEPS = ["Espacio", "Medidas", "Producto", "Contacto"];

const SPACES = [
  { key: "jardin", label: "Jardín / Terraza", desc: "Residencial o decorativo", icon: "🌲" },
  { key: "futbol", label: "Cancha de Fútbol", desc: "Minifútbol o fútbol sala", icon: "⚽" },
  { key: "tenis", label: "Tenis / Pádel", desc: "Canchas de raqueta", icon: "🎾" },
  { key: "infantil", label: "Zona Infantil", desc: "Parques y áreas de juego", icon: "🧒" },
  { key: "comercial", label: "Zona Comercial", desc: "Oficinas, locales, hoteles", icon: "🏢" },
  { key: "mascotas", label: "Zona de Mascotas", desc: "Sanitarios y juego para perros", icon: "🐾" },
] as const;

const SPACE_PRODUCT_SLUGS: Record<string, string[]> = {
  jardin: ["paisajismo", "tapicesped", "curly"],
  futbol: ["futbol"],
  tenis: ["tenis", "padel"],
  infantil: ["curly"],
  comercial: ["paisajismo", "tapicesped", "curly", "futbol", "tenis", "padel"],
  mascotas: ["bandeja-mascotas"],
};

function ProductRow({
  p,
  m2,
  selected,
  recommended,
  onSelect,
}: {
  p: GrassProduct;
  m2: number;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex gap-3 rounded-xl border-2 p-3 text-left transition-all hover:border-brand-primary hover:bg-grass-50 ${
        selected ? "border-brand-primary bg-grass-50" : "border-stone-200"
      }`}
    >
      {recommended && (
        <span className="absolute right-2 top-2 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-semibold text-white">
          RECOMENDADO
        </span>
      )}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-grass-100">
        {p.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-stone-900">{p.name}</div>
        <div className="mt-0.5 text-xs text-stone-500">
          Altura: {p.fiberHeight} · Garantía: {p.guarantee}
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-brand-primary">{formatCOP(p.pricePerM2)}/m²</span>
          {m2 > 0 && (
            <span className="text-xs text-stone-400">≈ {formatCOP(p.pricePerM2 * m2)}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [spaceKey, setSpaceKey] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const space = SPACES.find((s) => s.key === spaceKey);
  const m2 = (parseFloat(width || "0") || 0) * (parseFloat(length || "0") || 0);
  const recommendedSlugs = SPACE_PRODUCT_SLUGS[spaceKey] ?? [];
  const recommendedProducts = products.filter((p) => recommendedSlugs.includes(p.slug));
  const otherProducts = products.filter((p) => !recommendedSlugs.includes(p.slug));
  const product = products.find((p) => p.slug === productSlug);
  const estimate = product && m2 > 0 ? calculateQuote(m2, product.pricePerM2, includeInstallation) : null;

  const canContinue =
    (step === 0 && !!spaceKey) ||
    (step === 1 && m2 > 0) ||
    (step === 2 && !!productSlug) ||
    (step === 3 && name.trim().length > 1 && phone.trim().length > 6 && city.trim().length > 1);

  const handleSubmit = () => {
    const url = buildWhatsAppURL({
      name,
      phone,
      city,
      spaceType: space?.label,
      squareMeters: m2,
      productName: product?.name,
      installationNeeded: includeInstallation,
      totalPrice: estimate?.grandTotal,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="rounded-t-3xl bg-grass-gradient px-6 py-10 text-center sm:py-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Cotiza tu proyecto</h2>
        <p className="mt-2 text-white/85">Obtén un precio estimado en menos de 2 minutos</p>
      </div>

      {/* Stepper */}
      <div className="border-b border-stone-100 bg-white px-6 py-6 shadow-sm sm:px-10">
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    i <= step ? "bg-brand-primary text-white" : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? "text-stone-900" : "text-stone-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    i < step ? "bg-brand-primary" : "bg-stone-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-b-3xl bg-white p-6 shadow-2xl sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div>
                <h3 className="text-lg font-bold text-stone-900">¿Qué tipo de espacio vas a cubrir?</h3>
                <p className="mt-1 text-sm text-stone-500">Selecciona la categoría que mejor describe tu proyecto</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {SPACES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSpaceKey(s.key)}
                      className={`rounded-xl border-2 p-5 text-center transition-all hover:border-brand-primary hover:bg-grass-50 ${
                        spaceKey === s.key ? "border-brand-primary bg-grass-50" : "border-stone-200"
                      }`}
                    >
                      <div className="mb-3 text-3xl">{s.icon}</div>
                      <div className="font-semibold text-stone-900">{s.label}</div>
                      <div className="mt-1 text-xs text-stone-500">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-lg font-bold text-stone-900">¿Cuántos metros cuadrados necesitas?</h3>
                <p className="mt-1 text-sm text-stone-500">Ingresa las dimensiones aproximadas del espacio</p>

                <div className="mt-6 flex items-end gap-3">
                  <div className="flex-1">
                    <label className="label-field text-xs">Ancho</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ej: 5"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="input-field pr-8"
                        autoFocus
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">m</span>
                    </div>
                  </div>
                  <span className="pb-2.5 text-stone-400">×</span>
                  <div className="flex-1">
                    <label className="label-field text-xs">Largo</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ej: 8"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="input-field pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">m</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-stone-200 p-5 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Área total estimada</p>
                  <p className="mt-1 text-3xl font-bold text-brand-primary">{m2.toFixed(1)} m²</p>
                  {width && length && (
                    <p className="mt-1 text-xs text-stone-400">{width}m × {length}m</p>
                  )}
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={includeInstallation}
                    onChange={(e) => setIncludeInstallation(e.target.checked)}
                    className="accent-brand-primary"
                  />
                  Incluir instalación profesional
                </label>

                <div className="mt-5 flex gap-2 rounded-xl bg-blue-50 p-3.5 text-xs text-blue-700">
                  <Info className="h-4 w-4 shrink-0" />
                  <p>Si no conoces las medidas exactas, ingresa una estimación. Nuestro equipo las verificará contigo.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-bold text-stone-900">Elige tu tipo de grama</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Para <strong className="text-stone-700">{space?.label}</strong> recomendamos:
                </p>

                {recommendedProducts.length > 0 && (
                  <>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-grass-50 px-3 py-1 text-xs font-semibold text-brand-primary">
                      <Star className="h-3 w-3 fill-current" />
                      Recomendados para tu espacio
                    </span>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {recommendedProducts.map((p) => (
                        <ProductRow
                          key={p.slug}
                          p={p}
                          m2={m2}
                          selected={productSlug === p.slug}
                          recommended
                          onSelect={() => setProductSlug(p.slug)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {otherProducts.length > 0 && (
                  <>
                    <p className="mb-3 mt-6 text-sm font-medium text-stone-500">Otras opciones disponibles</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {otherProducts.map((p) => (
                        <ProductRow
                          key={p.slug}
                          p={p}
                          m2={m2}
                          selected={productSlug === p.slug}
                          recommended={false}
                          onSelect={() => setProductSlug(p.slug)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-bold text-stone-900">Casi listo — tu cotización</h3>
                <p className="mt-1 text-sm text-stone-500">Revisa el resumen e ingresa tus datos para enviarla por WhatsApp</p>

                {estimate && product && (
                  <div className="mt-5 rounded-xl border border-grass-200 bg-grass-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-grass-700">Resumen</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Espacio</span>
                        <span className="font-medium text-stone-900">{space?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Área</span>
                        <span className="font-medium text-stone-900">
                          {m2.toFixed(1)} m² ({width}m × {length}m)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Producto</span>
                        <span className="font-medium text-stone-900">{product.name} · {product.fiberHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Garantía</span>
                        <span className="font-medium text-stone-900">{product.guarantee}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-grass-200 pt-3 text-sm">
                      <div className="flex justify-between text-stone-600">
                        <span>Material ({m2.toFixed(0)} m² × {formatCOP(product.pricePerM2)})</span>
                        <span>{formatCOP(estimate.materialTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-600">
                        <span className="flex items-center gap-1.5">
                          Instalación profesional
                          {includeInstallation ? (
                            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-semibold text-white">Incluida</span>
                          ) : (
                            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-500">No incluida</span>
                          )}
                        </span>
                        <span>{formatCOP(estimate.installationTotal)}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-grass-200 pt-3">
                      <span className="font-semibold text-stone-900">Total estimado</span>
                      <span className="text-xl font-bold text-brand-primary">{formatCOP(estimate.grandTotal)}</span>
                    </div>
                    <p className="mt-2 text-xs text-stone-400">*Precio referencial. El valor final se confirma en visita técnica.</p>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field sm:col-span-2"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-secondary gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canContinue}
              className="btn-primary gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canContinue}
              className="btn-whatsapp gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar cotización
            </button>
          )}
        </div>

        {/* Dot progress (mobile) */}
        <div className="mt-6 flex justify-center gap-1.5 sm:hidden">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === step ? "bg-brand-primary" : "bg-stone-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
