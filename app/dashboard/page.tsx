import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/app/lib/authz";
import { MessageSquare, Package, FolderOpen, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { prisma } from "@/app/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STATUS_LABEL: Record<string, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUOTED: "Cotizado",
  CLOSED: "Cerrado",
  LOST: "Perdido",
};

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  QUOTED: "bg-grass-100 text-brand-primary",
  CLOSED: "bg-stone-100 text-stone-600",
  LOST: "bg-red-100 text-red-700",
};

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

export default async function DashboardPage() {
  await requireRole();
  const [productCount, projectCount, newLeadsCount, totalLeadsCount, recentLeads] = await Promise.all([
    prisma.grassProduct.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { name: true } } },
    }),
  ]);

  const statCards = [
    {
      label: "Cotizaciones nuevas",
      value: newLeadsCount.toString(),
      sub: "Requieren atención",
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/dashboard/leads",
    },
    {
      label: "Productos activos",
      value: productCount.toString(),
      sub: "En catálogo",
      icon: Package,
      color: "text-brand-primary",
      bg: "bg-grass-50",
      href: "/dashboard/productos",
    },
    {
      label: "Proyectos publicados",
      value: projectCount.toString(),
      sub: "En portafolio",
      icon: FolderOpen,
      color: "text-stone-600",
      bg: "bg-stone-100",
      href: "/dashboard/proyectos",
    },
    {
      label: "Total cotizaciones",
      value: totalLeadsCount.toString(),
      sub: "Histórico",
      icon: TrendingUp,
      color: "text-[#25D366]",
      bg: "bg-[#25D366]/10",
      href: "/dashboard/leads",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Resumen</h1>
        <p className="text-stone-500 text-sm mt-1">Panel de administración de Decorgrass</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-sm font-medium text-stone-600 mt-0.5">{s.label}</p>
            <p className="text-xs text-stone-400 mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent leads */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Últimas cotizaciones</h2>
            <Link href="/dashboard/leads" className="text-sm text-brand-primary hover:underline">
              Ver todas
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-stone-400">Todavía no hay cotizaciones.</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 text-sm">{lead.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {lead.product?.name ?? lead.spaceType ?? "Contacto general"}
                      {lead.squareMeters ? ` · ${lead.squareMeters} m²` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[lead.status] ?? "bg-stone-100 text-stone-600"}`}>
                      {STATUS_LABEL[lead.status] ?? lead.status}
                    </span>
                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      {timeAgo(lead.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">Acciones rápidas</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Añadir producto", href: "/dashboard/productos/nuevo", color: "btn-primary" },
              { label: "Ver cotizaciones", href: "/dashboard/leads", color: "btn-secondary" },
              { label: "Ver catálogo público", href: "/catalogo", color: "btn-secondary" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={`${a.color} w-full text-center py-2.5 text-sm`}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
