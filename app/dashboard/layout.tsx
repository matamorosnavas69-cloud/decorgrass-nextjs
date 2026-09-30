import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Package, FolderOpen, MessageSquare, ShoppingBag, Users } from "lucide-react";
import type { Metadata } from "next";
import AuthProvider from "@/app/components/auth/AuthProvider";
import { getActor } from "@/app/lib/authz";
import { ROLE_LABELS, hasPermission, type Permission } from "@/app/lib/rbac";

export const metadata: Metadata = {
  title: "Dashboard — Decorgrass Admin",
  robots: { index: false, follow: false },
};

// Sin `permission` = visible para cualquier rol. El menú es solo comodidad:
// la seguridad real la imponen el proxy, cada página y cada Server Action.
const navItems: { href: string; label: string; icon: typeof Users; permission?: Permission }[] = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Cotizaciones", icon: MessageSquare, permission: "leads:read" },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag, permission: "orders:read" },
  { href: "/dashboard/productos", label: "Productos", icon: Package, permission: "products:read" },
  { href: "/dashboard/proyectos", label: "Proyectos", icon: FolderOpen, permission: "projects:read" },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users, permission: "users:read" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const actor = await getActor();
  const role = actor?.role ?? null;
  const visibleItems = navItems.filter((item) => !item.permission || hasPermission(role, item.permission));

  return (
    <AuthProvider>
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
          {visibleItems.map(({ href, label, icon: Icon }) => (
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
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors text-sm"
          >
            Volver al sitio
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton />
            {role && <span className="text-xs font-medium text-stone-500">{ROLE_LABELS[role]}</span>}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
    </AuthProvider>
  );
}
