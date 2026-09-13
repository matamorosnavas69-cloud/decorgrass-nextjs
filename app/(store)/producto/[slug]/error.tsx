"use client";

import Link from "next/link";

export default function ProductoError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-max px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-4xl">🌿</p>
      <h1 className="mt-3 text-xl font-bold text-stone-900">No pudimos cargar este producto</h1>
      <p className="mt-2 text-sm text-stone-500">Intenta de nuevo o vuelve al catálogo.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Reintentar</button>
        <Link href="/catalogo" className="btn-secondary">Ver catálogo</Link>
      </div>
    </div>
  );
}
