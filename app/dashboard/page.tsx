import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Package, FolderOpen, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { products, projects } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Dashboard",
};

const statCards = [
  {
    label: "Cotizaciones pendientes",
    value: "—",
    sub: "Requieren atención",
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
    href: "/dashboard/leads",
  },
  {
    label: "Productos activos",
    value: products.length.toString(),
    sub: "En catálogo",
    icon: Package,
    color: "text-brand-primary",
    bg: "bg-grass-50",
    href: "/dashboard/productos",
  },
  {
    label: "Proyectos publicados",
    value: projects.length.toString(),
    sub: "En portafolio",
    icon: FolderOpen,
    color: "text-stone-600",
    bg: "bg-stone-100",
    href: "/dashboard/proyectos",
  },
  {
    label: "Conversión WhatsApp",
    value: "—",
    sub: "Este mes",
    icon: TrendingUp,
    color: "text-[#25D366]",
    bg: "bg-[#25D366]/10",
    href: "/dashboard/leads",
  },
];

const recentLeads = [
  { name: "Juan García", product: "Grama Fútbol 50mm", m2: 120, status: "Nuevo", date: "Hoy" },
  { name: "María López", product: "Paisajismo 35mm", m2: 45, status: "Contactado", date: "Ayer" },
  { name: "Carlos Ruiz", product: "Pádel 12mm", m2: 200, status: "Cotizado", date: "Hace 2 días" },
];

const statusColors: Record<string, string> = {
  Nuevo: "bg-amber-100 text-amber-800",
  Contactado: "bg-blue-100 text-blue-800",
  Cotizado: "bg-grass-100 text-brand-primary",
  Cerrado: "bg-stone-100 text-stone-600",
};

export default function DashboardPage() {
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
          <div className="divide-y divide-stone-100">
            {recentLeads.map((lead) => (
              <div key={lead.name} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 text-sm">{lead.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lead.product} · {lead.m2} m²
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[lead.status] ?? "bg-stone-100 text-stone-600"}`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    {lead.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
            <p className="text-xs text-stone-400 text-center">
              Datos de ejemplo · Conecta PostgreSQL para datos reales
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">Acciones rápidas</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Añadir producto", href: "/dashboard/productos/nuevo", color: "btn-primary" },
              { label: "Subir proyecto", href: "/dashboard/proyectos/nuevo", color: "btn-secondary" },
              { label: "Ver cotizador", href: "/cotizador", color: "btn-secondary" },
              { label: "Ver catálogo", href: "/catalogo", color: "btn-secondary" },
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

          <div className="px-4 pb-4">
            <div className="rounded-xl bg-grass-50 p-4">
              <p className="text-xs font-semibold text-brand-primary mb-1">Base de datos</p>
              <p className="text-xs text-stone-600">
                Configura <code className="bg-white px-1 rounded text-xs">DATABASE_URL</code> en{" "}
                <code className="bg-white px-1 rounded text-xs">.env.local</code> para activar
                almacenamiento de leads.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products quick view */}
      <div className="mt-6 bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Catálogo de productos</h2>
          <Link href="/dashboard/productos" className="text-sm text-brand-primary hover:underline">
            Gestionar
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Producto</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Slug</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Precio/m²</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Garantía</th>
                <th className="text-left px-6 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-stone-900">{p.name}</td>
                  <td className="px-6 py-3 text-stone-500 font-mono text-xs">{p.slug}</td>
                  <td className="px-6 py-3 text-stone-700">
                    ${p.pricePerM2.toLocaleString("es-CO")}
                  </td>
                  <td className="px-6 py-3 text-stone-500">{p.guarantee}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-grass-100 text-brand-primary font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      Activo
                    </span>
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
