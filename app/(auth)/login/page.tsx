import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Ingresar — Decorgrass Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-3xl">🌿</span>
          <h1 className="mt-2 text-xl font-bold text-stone-900">Decorgrass Admin</h1>
          <p className="mt-1 text-sm text-stone-500">Ingresa con tu cuenta de administrador</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
