"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import type { GrassProduct } from "@/app/lib/data";
import type { ProductFormState } from "@/app/lib/actions/products";

const CATEGORIES = [
  "decorativa",
  "deportiva",
  "accesorios",
  "paisajismo-verde",
  "paisajismo-colores",
  "curly",
  "tenis",
  "golf",
  "tapicesped",
  "futbol",
];

const BADGE_TYPES = ["", "green", "amber", "stone"] as const;

type Action = (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;

export default function ProductForm({ product, action, submitLabel }: { product?: GrassProduct; action: Action; submitLabel: string }) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Nombre</label>
          <input name="name" defaultValue={product?.name} required className="input-field" />
        </div>
        <div>
          <label className="label-field">Slug (URL)</label>
          <input name="slug" defaultValue={product?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="input-field" />
        </div>
      </div>

      <div>
        <label className="label-field">Descripción corta</label>
        <input name="shortDescription" defaultValue={product?.shortDescription} required className="input-field" />
      </div>

      <div>
        <label className="label-field">Descripción</label>
        <textarea name="description" defaultValue={product?.description} required rows={3} className="input-field resize-none" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field">Categoría</label>
          <select name="category" defaultValue={product?.category} required className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Precio por m² (COP)</label>
          <input type="number" name="pricePerM2" defaultValue={product?.pricePerM2} required min={0} className="input-field" />
        </div>
        <div>
          <label className="label-field">Garantía</label>
          <input name="guarantee" defaultValue={product?.guarantee} required placeholder="Ej: 3 años" className="input-field" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field">Altura de fibra</label>
          <input name="fiberHeight" defaultValue={product?.fiberHeight} required placeholder="Ej: 20 mm" className="input-field" />
        </div>
        <div>
          <label className="label-field">Densidad</label>
          <input name="density" defaultValue={product?.density} required placeholder="Ej: Alta" className="input-field" />
        </div>
        <div>
          <label className="label-field">Tono de color</label>
          <input name="toneColor" defaultValue={product?.toneColor} required placeholder="Ej: Verde natural" className="input-field" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Badge (opcional)</label>
          <input name="badge" defaultValue={product?.badge} placeholder="Ej: Más vendida" className="input-field" />
        </div>
        <div>
          <label className="label-field">Color del badge</label>
          <select name="badgeType" defaultValue={product?.badgeType ?? ""} className="input-field">
            {BADGE_TYPES.map((b) => <option key={b} value={b}>{b || "Sin badge"}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Usos (uno por línea)</label>
          <textarea name="uses" defaultValue={product?.uses.join("\n")} rows={4} placeholder="jardines&#10;terrazas" className="input-field resize-none font-mono text-xs" />
        </div>
        <div>
          <label className="label-field">Beneficios (uno por línea)</label>
          <textarea name="benefits" defaultValue={product?.benefits.join("\n")} rows={4} className="input-field resize-none text-xs" />
        </div>
        <div>
          <label className="label-field">Alturas disponibles (una por línea)</label>
          <textarea name="availableHeights" defaultValue={product?.availableHeights.join("\n")} rows={3} className="input-field resize-none text-xs" />
        </div>
        <div>
          <label className="label-field">Colores disponibles (uno por línea)</label>
          <textarea name="availableColors" defaultValue={product?.availableColors.join("\n")} rows={3} className="input-field resize-none text-xs" />
        </div>
      </div>

      <div>
        <label className="label-field">Imágenes — una ruta por línea (ej: /productos/nombre/foto.jpeg)</label>
        <textarea name="images" defaultValue={product?.images.join("\n")} rows={3} className="input-field resize-none text-xs font-mono" />
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { name: "petFriendly", label: "Pet friendly", checked: product?.petFriendly },
          { name: "childFriendly", label: "Apto para niños", checked: product?.childFriendly },
          { name: "sportSuitable", label: "Uso deportivo", checked: product?.sportSuitable },
          { name: "featured", label: "Destacado", checked: product?.featured },
          { name: "available", label: "Disponible", checked: product?.available ?? true },
        ].map((f) => (
          <label key={f.name} className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name={f.name} defaultChecked={f.checked} className="accent-brand-primary" />
            {f.label}
          </label>
        ))}
      </div>

      <button type="submit" disabled={isPending} className="btn-primary px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
