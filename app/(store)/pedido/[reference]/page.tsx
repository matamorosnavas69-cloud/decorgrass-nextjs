import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle, MessageCircle } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { formatCOP, getWhatsAppContactURL } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Estado de tu pedido",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ reference: string }>;
}

// El id de transacción que Wompi agrega al redirect-url (?id=...) NO se usa
// para decidir el estado del pedido — según la documentación de Wompi, las
// consultas de transacción desde el frontend ya no están soportadas. El
// estado real lo actualiza únicamente el webhook verificado en
// app/api/webhooks/wompi/route.ts. Esta página solo muestra lo que ya está
// en la base — puede seguir en "PENDING" un momento si el webhook tarda.
export default async function PedidoPage({ params }: PageProps) {
  const { reference } = await params;
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!order) notFound();

  const statusInfo = {
    PENDING: { icon: Clock, label: "Verificando el pago...", color: "text-amber-500" },
    APPROVED: { icon: CheckCircle2, label: "Pago aprobado", color: "text-brand-primary" },
    DECLINED: { icon: XCircle, label: "Pago rechazado", color: "text-red-500" },
    VOIDED: { icon: XCircle, label: "Pago anulado", color: "text-stone-500" },
    ERROR: { icon: XCircle, label: "Error procesando el pago", color: "text-red-500" },
  }[order.status];

  const Icon = statusInfo.icon;

  return (
    <div className="container-max max-w-lg px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="card p-6 text-center">
        <Icon className={`mx-auto h-12 w-12 ${statusInfo.color}`} />
        <h1 className="mt-4 text-xl font-bold text-stone-900">{statusInfo.label}</h1>
        <p className="mt-1 font-mono text-sm text-stone-400">{order.reference}</p>

        <div className="mt-6 space-y-2 rounded-xl bg-stone-50 p-4 text-left text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-stone-600">
                {item.productName} ({item.squareMeters} m²)
              </span>
              <span className="font-medium text-stone-900">{formatCOP(item.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-stone-200 pt-2 font-semibold">
            <span>Total</span>
            <span className="text-brand-primary">{formatCOP(order.total)}</span>
          </div>
        </div>

        {order.status === "PENDING" && (
          <p className="mt-4 text-xs text-stone-400">
            Si el pago ya se completó y esto no se actualiza en unos minutos, recargá la página.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/catalogo" className="btn-secondary flex-1 justify-center">
            Seguir comprando
          </Link>
          <a
            href={getWhatsAppContactURL(`Hola, tengo una pregunta sobre mi pedido ${order.reference}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 justify-center"
          >
            <MessageCircle className="h-4 w-4" />
            Hablar con nosotros
          </a>
        </div>
      </div>
    </div>
  );
}
