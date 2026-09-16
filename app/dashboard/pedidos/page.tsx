import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/app/lib/db";
import { formatCOP } from "@/app/lib/utils";

export const metadata: Metadata = { title: "Pedidos — Dashboard" };

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  DECLINED: "Rechazado",
  VOIDED: "Anulado",
  ERROR: "Error",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-grass-100 text-brand-primary",
  DECLINED: "bg-red-100 text-red-700",
  VOIDED: "bg-stone-100 text-stone-600",
  ERROR: "bg-red-100 text-red-700",
};

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Pedidos</h1>
        <p className="text-stone-500 text-sm mt-1">{orders.length} en total</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-stone-400">Todavía no hay pedidos pagados desde el checkout.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Referencia</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Items</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Fecha</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-stone-500">{order.reference}</td>
                    <td className="px-6 py-3 font-medium text-stone-900">{order.customerName}</td>
                    <td className="px-6 py-3 text-stone-500">{order.items.length}</td>
                    <td className="px-6 py-3 text-stone-700">{formatCOP(order.total)}</td>
                    <td className="px-6 py-3 text-stone-500">
                      {order.createdAt.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/dashboard/pedidos/${order.id}`} className="text-brand-primary hover:underline text-xs font-medium">
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
