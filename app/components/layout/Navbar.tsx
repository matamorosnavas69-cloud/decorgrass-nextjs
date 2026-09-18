"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { getWhatsAppContactURL } from "@/app/lib/utils";
import { useCart } from "@/app/hooks/useCart";

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/instalacion", label: "Instalación" },
  { href: "/cotizador", label: "Cotizador" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hasDarkHero = pathname === "/";
  const [scrolledState, setScrolledState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = !hasDarkHero || scrolledState;
  const cartCount = useCart((s) => s.items.length);

  useEffect(() => {
    const handler = () => setScrolledState(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container-max flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image src="/logo-dg.png" alt="Decorgrass" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <span className={cn("font-bold", scrolled ? "text-stone-900" : "text-white drop-shadow")}>
            Decor<span className="text-brand-light">grass</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-stone-700 hover:bg-grass-50 hover:text-brand-primary"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            aria-label="Carrito"
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              scrolled ? "text-stone-800 hover:bg-stone-100" : "text-white hover:bg-white/10"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <a
            href={getWhatsAppContactURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1ebe57] hover:shadow-md sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            href="/cotizador"
            className={cn(
              "hidden rounded-full px-4 py-2 text-sm font-semibold transition-all lg:block",
              scrolled
                ? "bg-brand-primary text-white hover:bg-brand-dark"
                : "bg-white text-brand-primary hover:bg-grass-50"
            )}
          >
            Cotizar
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden",
              scrolled ? "text-stone-800 hover:bg-stone-100" : "text-white hover:bg-white/10"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-stone-100 bg-white shadow-lg lg:hidden"
          >
            <div className="container-max space-y-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-grass-50 hover:text-brand-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex gap-2 pt-2">
                <Link
                  href="/cotizador"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 text-center"
                >
                  Cotizar mi proyecto
                </Link>
                <a
                  href={getWhatsAppContactURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 text-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
