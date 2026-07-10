import type { Metadata } from "next";
import Link from "next/link";
import { benefits } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Nosotros — Quiénes Somos",
  description:
    "Somos Decorgrass, especialistas en grama sintética premium en Colombia. Conoce nuestra historia, valores y compromiso con la calidad.",
};

export default function NosotrosPage() {
  return (
    <div className="pt-16">
      <div className="bg-grass-gradient px-4 py-20 sm:px-6 lg:px-8">
        <div className="container-max max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
            Nuestra historia
          </span>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Transformamos espacios, transformamos vidas
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Somos una empresa colombiana especializada en venta e instalación de grama sintética de alta calidad.
          </p>
        </div>
      </div>

      <div className="container-max section-padding">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">¿Por qué Decorgrass?</h2>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Nacimos de la convicción de que los colombianos merecen espacios verdes,
              hermosos y de bajo mantenimiento. Con Decorgrass, tener un jardín perfecto
              ya no es un lujo ni una tarea interminable.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Trabajamos con los mejores proveedores de grama sintética a nivel internacional
              y nuestros instaladores están capacitados para garantizar acabados perfectos
              en cualquier tipo de superficie.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Desde jardines residenciales hasta canchas deportivas, tenemos la solución
              ideal para cada proyecto y presupuesto.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { stat: "+200", label: "Proyectos completados" },
              { stat: "5 años", label: "Garantía máxima en nuestros productos" },
              { stat: "100%", label: "Clientes satisfechos con seguimiento" },
              { stat: "Todo Colombia", label: "Cobertura de instalación" },
            ].map((s) => (
              <div key={s.label} className="card p-5 flex items-center gap-5">
                <div className="text-3xl font-bold text-brand-primary w-28 shrink-0">{s.stat}</div>
                <p className="text-stone-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Nuestros valores
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.slice(0, 4).map((b) => (
              <div key={b.title} className="rounded-2xl bg-stone-50 p-6 text-center">
                <div className="mb-3 text-3xl">{b.icon}</div>
                <h3 className="mb-1.5 font-semibold text-stone-900">{b.title}</h3>
                <p className="text-sm text-stone-500">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-stone-900">
            ¿Listo para transformar tu espacio?
          </h2>
          <p className="mt-2 text-stone-500">
            Conversemos sobre tu proyecto. Sin compromiso.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/cotizador" className="btn-primary px-8 py-3.5 text-base">
              Cotizar mi proyecto
            </Link>
            <Link href="/proyectos" className="btn-secondary px-8 py-3.5 text-base">
              Ver proyectos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
