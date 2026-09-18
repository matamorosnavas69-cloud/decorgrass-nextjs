"use server";

import { randomBytes } from "node:crypto";
import { prisma } from "@/app/lib/db";
import { getProductBySlug } from "@/app/lib/queries/products";
import { calculateQuote } from "@/app/lib/utils";
import { checkoutFormSchema } from "@/app/lib/validations/order";
import { buildWompiIntegritySignature } from "@/app/lib/wompi";

export type CreateOrderResult =
  | {
      ok: true;
      reference: string;
      amountInCents: number;
      currency: string;
      // null cuando WOMPI_INTEGRITY_SECRET no está configurada — el pedido
      // igual se crea (el cliente ya quedó registrado), el checkout solo
      // no puede ofrecer el botón de pago online y cae al flujo por
      // WhatsApp con el número de pedido. El pago nunca es el motivo por
      // el que un pedido no se registra.
      signature: string | null;
    }
  | { ok: false; error: string };

function generateReference(): string {
  return `DG-${Date.now()}-${randomBytes(3).toString("hex")}`;
}

export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  const parsed = checkoutFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const data = parsed.data;

  // El precio de cada línea se recalcula en el servidor contra el catálogo
  // real — nunca se confía en un subtotal que pudo llegar manipulado del
  // carrito del cliente (mismo principio que createQuoteLead).
  const lineItems: {
    productId: string;
    productName: string;
    productSlug: string;
    pricePerM2: number;
    squareMeters: number;
    installationNeeded: boolean;
    subtotal: number;
  }[] = [];

  for (const item of data.items) {
    const product = await getProductBySlug(item.productSlug);
    if (!product) return { ok: false, error: `Producto no encontrado: ${item.productSlug}` };
    if (!product.available) return { ok: false, error: `${product.name} ya no está disponible` };

    const quote = calculateQuote(item.squareMeters, product.pricePerM2, item.installationNeeded);
    lineItems.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      pricePerM2: product.pricePerM2,
      squareMeters: item.squareMeters,
      installationNeeded: item.installationNeeded,
      subtotal: quote.grandTotal,
    });
  }

  const total = lineItems.reduce((sum, i) => sum + i.subtotal, 0);
  if (total <= 0) return { ok: false, error: "El total del pedido debe ser mayor a 0" };

  const reference = generateReference();

  try {
    await prisma.order.create({
      data: {
        reference,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerCity: data.customerCity,
        customerAddress: data.customerAddress,
        subtotal: total,
        total,
        items: { create: lineItems.map(({ productId, ...rest }) => ({ ...rest, productId })) },
      },
    });
  } catch (e) {
    console.error("[orders] createOrder error:", e);
    return { ok: false, error: "No se pudo crear el pedido. Intenta de nuevo." };
  }

  const amountInCents = total * 100;
  const currency = "COP";

  let signature: string | null;
  try {
    signature = buildWompiIntegritySignature({ reference, amountInCents, currency });
  } catch (e) {
    console.error("[orders] buildWompiIntegritySignature error, pago online no disponible:", e);
    signature = null;
  }

  return { ok: true, reference, amountInCents, currency, signature };
}
