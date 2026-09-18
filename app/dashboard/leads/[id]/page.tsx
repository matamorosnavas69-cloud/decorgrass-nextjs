import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Mail, Ruler, MapPin, Calendar } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { getWhatsAppContactURL } from "@/app/lib/utils";
import LeadStatusSelect from "../LeadStatusSelect";
import NotesForm from "./NotesForm";

export const metadata: Metadata = { title: "Detalle de cotización — Dashboard" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { product: true } });
  if (!lead) notFound();

  const whatsappUrl = getWhatsAppContactURL(
    `Hola ${lead.name}, te escribo de Decorgrass sobre tu cotización${lead.product ? ` de ${lead.product.name}` : ""}.`
  );

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/leads" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="h-4 w-4" /> Volver a cotizaciones
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{lead.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <Calendar className="h-3.5 w-3.5" />
            {lead.createdAt.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <LeadStatusSelect leadId={lead.id} status={lead.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Contacto</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Teléfono</dt><dd className="font-medium text-stone-900">{lead.phone}</dd></div>
            {lead.email && <div className="flex justify-between"><dt className="text-stone-500">Email</dt><dd className="font-medium text-stone-900">{lead.email}</dd></div>}
            {lead.city && (
              <div className="flex justify-between">
                <dt className="text-stone-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Ciudad</dt>
                <dd className="font-medium text-stone-900">{lead.city}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 flex gap-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center py-2 text-sm">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="btn-secondary flex-1 justify-center py-2 text-sm">
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Proyecto</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Tipo de espacio</dt><dd className="font-medium text-stone-900">{lead.spaceType ?? "—"}</dd></div>
            {lead.squareMeters && (
              <div className="flex justify-between">
                <dt className="text-stone-500 flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> Metros cuadrados</dt>
                <dd className="font-medium text-stone-900">{lead.squareMeters} m²</dd>
              </div>
            )}
            <div className="flex justify-between"><dt className="text-stone-500">Instalación</dt><dd className="font-medium text-stone-900">{lead.installationNeeded ? "Sí, requerida" : "No"}</dd></div>
            {lead.product && (
              <div className="flex justify-between">
                <dt className="text-stone-500">Producto</dt>
                <dd className="font-medium text-stone-900">
                  <Link href={`/producto/${lead.product.slug}`} className="text-brand-primary hover:underline">{lead.product.name}</Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-stone-200 p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Notas internas</h2>
        <NotesForm leadId={lead.id} initialNotes={lead.notes ?? ""} />
      </div>
    </div>
  );
}
