import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/app/lib/authz";
import { hasPermission } from "@/app/lib/rbac";
import { prisma } from "@/app/lib/db";
import LeadStatusSelect from "./LeadStatusSelect";

export const metadata: Metadata = { title: "Cotizaciones — Dashboard" };

export default async function LeadsPage() {
  const { role } = await requirePermission("leads:read");
  const canWrite = hasPermission(role, "leads:write");
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Cotizaciones</h1>
        <p className="text-stone-500 text-sm mt-1">{leads.length} en total</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {leads.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-stone-400">Todavía no hay cotizaciones ni mensajes de contacto.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Nombre</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Contacto</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Producto / espacio</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Ciudad</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Fecha</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-stone-900">{lead.name}</td>
                    <td className="px-6 py-3 text-stone-600">{lead.phone}</td>
                    <td className="px-6 py-3 text-stone-600">
                      {lead.product?.name ?? lead.spaceType ?? "—"}
                      {lead.squareMeters ? ` · ${lead.squareMeters} m²` : ""}
                    </td>
                    <td className="px-6 py-3 text-stone-500">{lead.city ?? "—"}</td>
                    <td className="px-6 py-3 text-stone-500">
                      {lead.createdAt.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3">
                      <LeadStatusSelect leadId={lead.id} status={lead.status} readOnly={!canWrite} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/dashboard/leads/${lead.id}`} className="text-brand-primary hover:underline text-xs font-medium">
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
