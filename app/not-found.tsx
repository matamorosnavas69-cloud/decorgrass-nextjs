import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🌿</div>
      <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl">404</h1>
      <p className="mt-4 text-lg text-stone-500">Esta página no existe... pero tu jardín puede ser perfecto.</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary px-8 py-3">Ir al inicio</Link>
        <Link href="/catalogo" className="btn-secondary px-8 py-3">Ver catálogo</Link>
        <Link href="/cotizador" className="btn-secondary px-8 py-3">Cotizar</Link>
      </div>
    </div>
  );
}
