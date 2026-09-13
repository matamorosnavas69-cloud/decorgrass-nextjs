import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProducts } from "@/app/lib/queries/products";
import { formatCOP } from "@/app/lib/utils";
import ToggleAvailabilityButton from "./ToggleAvailabilityButton";

export const metadata: Metadata = { title: "Productos — Dashboard" };

export default async function ProductosPage() {
  const products = await getAllProducts();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Productos</h1>
          <p className="text-stone-500 text-sm mt-1">{products.length} en catálogo</p>
        </div>
        <Link href="/dashboard/productos/nuevo" className="btn-primary gap-1.5 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Añadir producto
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Producto</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Categoría</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Precio/m²</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Destacado</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-stone-900">{p.name}</td>
                  <td className="px-6 py-3 text-stone-500">{p.category}</td>
                  <td className="px-6 py-3 text-stone-700">{formatCOP(p.pricePerM2)}</td>
                  <td className="px-6 py-3 text-stone-500">{p.featured ? "Sí" : "—"}</td>
                  <td className="px-6 py-3">
                    <ToggleAvailabilityButton id={p.id} available={p.available} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/dashboard/productos/${p.id}`} className="text-brand-primary hover:underline text-xs font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
