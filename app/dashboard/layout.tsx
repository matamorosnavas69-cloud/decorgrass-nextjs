import Link from "next/link";
import { LayoutDashboard, Package, FolderOpen, MessageSquare, LogOut } from "lucide-react";
import type { Metadata } from "next";
import { getSession } from "@/app/lib/auth";
import { logoutAction } from "@/app/lib/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard — Decorgrass Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Cotizaciones", icon: MessageSquare },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/proyectos", label: "Proyectos", icon: FolderOpen },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-200">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="font-bold text-stone-900 text-sm leading-tight">Decorgrass</p>
              <p className="text-xs text-stone-400">Panel de administración</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors text-sm font-medium"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-200 space-y-1">
          {session && <p className="px-3 pb-1 text-xs text-stone-400 truncate">{session.email}</p>}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors text-sm"
          >
            Volver al sitio
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
