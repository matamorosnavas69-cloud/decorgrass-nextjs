"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart, cartItemSubtotal, cartTotal } from "@/app/hooks/useCart";
import { formatCOP } from "@/app/lib/utils";

export default function CarritoPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateItem = useCart((s) => s.updateItem);

  if (items.length === 0) {
    return (
      <div className="container-max px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingCart className="mx-auto h-12 w-12 text-stone-300" />
        <h1 className="mt-4 text-xl font-bold text-stone-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-stone-500">Agregá productos desde el catálogo para empezar.</p>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="container-max px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">Tu carrito</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const subtotal = cartItemSubtotal(item);
            return (
              <div key={item.productId} className="card flex gap-4 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-grass-50">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/producto/${item.slug}`} className="font-semibold text-stone-900 hover:text-brand-primary">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Quitar del carrito"
                      className="shrink-0 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-400">{formatCOP(item.pricePerM2)}/m²</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-stone-600">
                      m²
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={item.squareMeters}
                        onChange={(e) => updateItem(item.productId, { squareMeters: Number(e.target.value) || 0 })}
                        className="w-20 rounded-lg border border-stone-200 px-2 py-1 text-xs"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-stone-600">
                      <input
                        type="checkbox"
                        checked={item.installationNeeded}
                        onChange={(e) => updateItem(item.productId, { installationNeeded: e.target.checked })}
                        className="accent-brand-primary"
                      />
                      Instalación
                    </label>
                  </div>

                  <p className="mt-2 text-right font-semibold text-brand-primary">{formatCOP(subtotal)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-semibold text-stone-900">Resumen</h2>
          <div className="flex justify-between border-t border-stone-100 pt-3 text-lg font-bold">
            <span>Total</span>
            <span className="text-brand-primary">{formatCOP(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full justify-center gap-2 py-3">
            Ir a pagar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
