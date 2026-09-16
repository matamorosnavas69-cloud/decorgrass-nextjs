import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import { verifyWompiWebhookChecksum, type WompiWebhookPayload } from "@/app/lib/wompi";
import type { OrderStatus } from "@prisma/client";

// La única fuente confiable del estado real de un pago: la página de
// confirmación NUNCA marca un pedido como pagado por sí misma (ver
// docs de Wompi — "las consultas de transacción desde el frontend ya no
// están soportadas"), solo este webhook, verificado con el checksum.
const VALID_STATUSES: OrderStatus[] = ["PENDING", "APPROVED", "DECLINED", "VOIDED", "ERROR"];

export async function POST(request: NextRequest) {
  let payload: WompiWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!verifyWompiWebhookChecksum(payload)) {
    console.error("[wompi webhook] checksum inválido, evento descartado");
    return NextResponse.json({ error: "Checksum inválido" }, { status: 401 });
  }

  if (payload.event !== "transaction.updated") {
    return NextResponse.json({ ok: true }); // evento que no nos interesa, pero confirmamos recepción
  }

  const transaction = payload.data.transaction as
    | { id?: string; reference?: string; status?: string }
    | undefined;
  if (!transaction?.reference || !transaction.status) {
    return NextResponse.json({ error: "Payload sin transaction.reference/status" }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(transaction.status as OrderStatus)) {
    return NextResponse.json({ error: "Estado de transacción desconocido" }, { status: 400 });
  }

  try {
    await prisma.order.update({
      where: { reference: transaction.reference },
      data: {
        status: transaction.status as OrderStatus,
        wompiTransactionId: transaction.id,
      },
    });
  } catch (e) {
    // Orden no encontrada u otro error — respondemos 200 igual para que Wompi
    // no reintente un webhook para una referencia que nunca vamos a poder
    // resolver; el error queda en los logs para investigar manualmente.
    console.error("[wompi webhook] no se pudo actualizar la orden:", e);
  }

  return NextResponse.json({ ok: true });
}
