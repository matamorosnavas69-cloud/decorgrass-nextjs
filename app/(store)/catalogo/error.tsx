"use client";

export default function CatalogoError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-max px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-4xl">🌿</p>
      <h1 className="mt-3 text-xl font-bold text-stone-900">No pudimos cargar el catálogo</h1>
      <p className="mt-2 text-sm text-stone-500">Intenta de nuevo en unos segundos.</p>
      <button onClick={reset} className="btn-primary mt-6">
        Reintentar
      </button>
    </div>
  );
}
