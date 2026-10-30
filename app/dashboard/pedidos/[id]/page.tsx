import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/app/lib/authz";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { formatCOP } from "@/app/lib/utils";

export const metadata: Metadata = { title: "Detalle de pedido — Dashboard" };

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  DECLINED: "Rechazado",
  VOIDED: "Anulado",
  ERROR: "Error",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: PageProps) {
  await requirePermission("orders:read");
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/dashboard/pedidos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-lg font-bold text-stone-900">{order.reference}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {order.createdAt.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <span className="rounded-full bg-grass-100 px-3 py-1 text-sm font-medium text-brand-primary">
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Cliente</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Nombre</dt><dd className="font-medium text-stone-900">{order.customerName}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Teléfono</dt><dd className="font-medium text-stone-900">{order.customerPhone}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Email</dt><dd className="font-medium text-stone-900">{order.customerEmail}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Ciudad</dt><dd className="font-medium text-stone-900">{order.customerCity}</dd></div>
          </dl>
          <p className="mt-3 text-sm text-stone-600">{order.customerAddress}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Pago</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Total</dt><dd className="font-semibold text-brand-primary">{formatCOP(order.total)}</dd></div>
            {order.wompiTransactionId && (
              <div className="flex justify-between"><dt className="text-stone-500">Transacción Wompi</dt><dd className="font-mono text-xs text-stone-700">{order.wompiTransactionId}</dd></div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Productos</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-stone-900">{item.productName}</p>
                <p className="text-xs text-stone-500">
                  {item.squareMeters} m² · {formatCOP(item.pricePerM2)}/m²{item.installationNeeded ? " · con instalación" : ""}
                </p>
              </div>
              <span className="font-semibold text-stone-900">{formatCOP(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
