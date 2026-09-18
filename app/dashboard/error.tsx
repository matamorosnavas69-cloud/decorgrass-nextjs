"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h1 className="text-lg font-bold text-stone-900">Algo salió mal en el panel</h1>
      <p className="mt-2 text-sm text-stone-500">Intenta de nuevo. Si persiste, revisa la conexión a la base de datos.</p>
      <button onClick={reset} className="btn-primary mt-6">
        Reintentar
      </button>
    </div>
  );
}
