"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/auth";
import { getProductBySlug } from "@/app/lib/queries/products";
import { calculateQuote, formatCOP } from "@/app/lib/utils";
import { notifyNewLead } from "@/app/lib/email";
import { quoteLeadSchema, contactLeadSchema } from "@/app/lib/validations/lead";
import { LeadStatus } from "@prisma/client";

export type LeadActionResult = { ok: true } | { ok: false; error: string };

// ponytail: sin dedupe por DB; el botón se deshabilita mientras la acción está
// en curso (ver QuoteWizard/ContactoPage), que cubre el caso real de doble click.

export async function createQuoteLead(input: unknown): Promise<LeadActionResult> {
  const parsed = quoteLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const data = parsed.data;
  if (data.company) return { ok: true }; // honeypot: bot detectado, no persistir, no delatar

  const product = await getProductBySlug(data.productSlug);
  if (!product) return { ok: false, error: "Producto no encontrado" };

  // El precio se calcula en el servidor a partir del catálogo del servidor,
  // nunca a partir de un total que pudo haber sido manipulado en el cliente.
  const quote = calculateQuote(data.squareMeters, product.pricePerM2, data.installationNeeded);

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        spaceType: data.spaceType,
        squareMeters: data.squareMeters,
        installationNeeded: data.installationNeeded,
        productId: product.id,
        notes: `Producto: ${product.name} (${product.slug}) · Precio/m²: ${formatCOP(product.pricePerM2)} · Total estimado: ${formatCOP(quote.grandTotal)}`,
      },
    });
    await notifyNewLead({
      kind: "cotización",
      name: data.name,
      phone: data.phone,
      city: data.city,
      spaceType: data.spaceType,
      squareMeters: data.squareMeters,
      productName: product.name,
    });
    return { ok: true };
  } catch (e) {
    console.error("[leads] createQuoteLead error:", e);
    return { ok: false, error: "No se pudo guardar la cotización. Intenta de nuevo o escríbenos por WhatsApp." };
  }
}

export async function createContactLead(input: unknown): Promise<LeadActionResult> {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const data = parsed.data;
  if (data.company) return { ok: true }; // honeypot

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        spaceType: data.spaceType,
        notes: data.message,
      },
    });
    await notifyNewLead({
      kind: "contacto",
      name: data.name,
      phone: data.phone,
      spaceType: data.spaceType,
      message: data.message,
    });
    return { ok: true };
  } catch (e) {
    console.error("[leads] createContactLead error:", e);
    return { ok: false, error: "No se pudo enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp." };
  }
}

/* ── Acciones de admin (requieren sesión) ──────────────────────── */

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${id}`);
  revalidatePath("/dashboard");
}

export async function updateLeadNotes(id: string, notes: string): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { notes } });
  revalidatePath(`/dashboard/leads/${id}`);
}

export type NotesFormState = { saved?: boolean };

export async function updateLeadNotesAction(_prev: NotesFormState, formData: FormData): Promise<NotesFormState> {
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  await updateLeadNotes(id, notes);
  return { saved: true };
}
