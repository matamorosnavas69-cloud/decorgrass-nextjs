import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = { title: "Acceso denegado — Decorgrass" };

export default function AccesoDenegadoPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
      <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
      <h1 className="mt-4 text-xl font-bold text-stone-900">No tienes acceso a esta sección</h1>
      <p className="mt-2 text-sm text-stone-500">
        Tu cuenta no tiene los permisos necesarios. Si crees que es un error, pídele a un administrador que revise tu rol.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/dashboard" className="btn-primary w-full py-2.5">
          Ir al panel
        </Link>
        <SignOutButton redirectUrl="/sign-in">
          <button type="button" className="btn-secondary w-full py-2.5">
            Cerrar sesión
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
