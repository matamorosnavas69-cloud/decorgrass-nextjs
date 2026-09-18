"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import ProductCard from "@/app/components/ui/ProductCard";
import type { GrassProduct, GrassCategory, GrassUse } from "@/app/lib/data";

interface CatalogClientProps {
  products: GrassProduct[];
  initialUse?: string;
  initialCategory?: string;
}

const categories: { value: GrassCategory | "all"; label: string; icon?: string }[] = [
  { value: "all", label: "Todos" },
  { value: "decorativa", label: "Decorativa", icon: "🌿" },
  { value: "deportiva", label: "Deportiva", icon: "🏅" },
  { value: "accesorios", label: "Accesorios", icon: "🐾" },
  { value: "paisajismo-verde", label: "Paisajismo Verde", icon: "🌿" },
  { value: "paisajismo-colores", label: "Paisajismo de Colores", icon: "🎨" },
  { value: "curly", label: "Curly", icon: "🌀" },
  { value: "tenis", label: "Tenis", icon: "🎾" },
  { value: "golf", label: "Golf", icon: "⛳" },
  { value: "tapicesped", label: "Tapicésped", icon: "🟩" },
  { value: "futbol", label: "Fútbol", icon: "⚽" },
];

const uses: { value: GrassUse | "all"; label: string }[] = [
  { value: "all", label: "Todos los usos" },
  { value: "jardines", label: "Jardines" },
  { value: "terrazas", label: "Terrazas" },
  { value: "balcones", label: "Balcones" },
  { value: "pet-friendly", label: "Pet friendly" },
  { value: "zonas-infantiles", label: "Zonas infantiles" },
  { value: "deportiva", label: "Deportiva" },
];

const sortOptions = [
  { value: "default", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
];

interface FilterPanelProps {
  category: GrassCategory | "all";
  setCategory: (c: GrassCategory | "all") => void;
  use: GrassUse | "all";
  setUse: (u: GrassUse | "all") => void;
  priceMax: number;
  setPriceMax: (p: number) => void;
  petOnly: boolean;
  setPetOnly: (v: boolean) => void;
  childOnly: boolean;
  setChildOnly: (v: boolean) => void;
  activeFilters: number;
  resetFilters: () => void;
}

function FilterPanel({
  category,
  setCategory,
  use,
  setUse,
  priceMax,
  setPriceMax,
  petOnly,
  setPetOnly,
  childOnly,
  setChildOnly,
  activeFilters,
  resetFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Categoría
        </p>
        <div className="space-y-1">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                category === c.value
                  ? "bg-grass-100 font-medium text-brand-primary"
                  : "text-stone-600 hover:bg-stone-50"
              )}
            >
              {c.icon && <span className="mr-2">{c.icon}</span>}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Uso
        </p>
        <div className="space-y-1">
          {uses.map((u) => (
            <button
              key={u.value}
              onClick={() => setUse(u.value)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                use === u.value
                  ? "bg-grass-100 font-medium text-brand-primary"
                  : "text-stone-600 hover:bg-stone-50"
              )}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Precio máximo / m²
        </p>
        <input
          type="range"
          min={30000}
          max={100000}
          step={5000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-brand-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-stone-400">
          <span>$30.000</span>
          <span className="font-medium text-brand-primary">
            ${priceMax.toLocaleString("es-CO")}
          </span>
          <span>$100.000</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Características
        </p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={petOnly}
              onChange={(e) => setPetOnly(e.target.checked)}
              className="accent-brand-primary"
            />
            🐕 Pet friendly
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={childOnly}
              onChange={(e) => setChildOnly(e.target.checked)}
              className="accent-brand-primary"
            />
            🧒 Apto niños
          </label>
        </div>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar filtros ({activeFilters})
        </button>
      )}
    </div>
  );
}

export default function CatalogClient({
  products,
  initialUse,
  initialCategory,
}: CatalogClientProps) {
  const [category, setCategory] = useState<GrassCategory | "all">(
    (initialCategory as GrassCategory) || "all"
  );
  const [use, setUse] = useState<GrassUse | "all">(
    (initialUse as GrassUse) || "all"
  );
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [petOnly, setPetOnly] = useState(false);
  const [childOnly, setChildOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.available);

    if (category !== "all") result = result.filter((p) => p.category === category);
    if (use !== "all") result = result.filter((p) => p.uses.includes(use));
    if (petOnly) result = result.filter((p) => p.petFriendly);
    if (childOnly) result = result.filter((p) => p.childFriendly);
    result = result.filter((p) => p.pricePerM2 <= priceMax);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc": return [...result].sort((a, b) => a.pricePerM2 - b.pricePerM2);
      case "price-desc": return [...result].sort((a, b) => b.pricePerM2 - a.pricePerM2);
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [products, category, use, priceMax, sort, search, petOnly, childOnly]);

  const activeFilters =
    (category !== "all" ? 1 : 0) +
    (use !== "all" ? 1 : 0) +
    (petOnly ? 1 : 0) +
    (childOnly ? 1 : 0) +
    (priceMax < 100000 ? 1 : 0);

  const resetFilters = () => {
    setCategory("all");
    setUse("all");
    setPriceMax(100000);
    setPetOnly(false);
    setChildOnly(false);
    setSearch("");
  };

  const filterPanelProps: FilterPanelProps = {
    category,
    setCategory,
    use,
    setUse,
    priceMax,
    setPriceMax,
    petOnly,
    setPetOnly,
    childOnly,
    setChildOnly,
    activeFilters,
    resetFilters,
  };

  return (
    <div className="container-max px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      {/* Mobile filter button + search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Buscar grama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-4"
          />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors lg:hidden",
            activeFilters > 0
              ? "border-brand-primary bg-grass-50 text-brand-primary"
              : "border-stone-200 text-stone-700 hover:bg-stone-50"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros {activeFilters > 0 && `(${activeFilters})`}
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto min-w-[160px] hidden sm:block"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <FilterPanel {...filterPanelProps} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-stone-500">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto min-w-[160px] sm:hidden"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl">🌿</p>
              <p className="mt-3 font-medium text-stone-700">Sin resultados</p>
              <p className="mt-1 text-sm text-stone-400">Prueba ajustando los filtros</p>
              <button onClick={resetFilters} className="btn-secondary mt-4 text-sm">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white p-6 shadow-xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold">Filtros</h2>
                <button onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel {...filterPanelProps} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
