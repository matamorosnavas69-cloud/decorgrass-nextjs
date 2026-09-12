import Image from "next/image";

const STATS = [
  { stat: "+200", label: "Proyectos completados" },
  { stat: "5 años", label: "Garantía máxima en nuestros productos" },
  { stat: "100%", label: "Clientes satisfechos con seguimiento" },
  { stat: "Todo Colombia", label: "Cobertura de instalación" },
];

export default function ProjectTrust() {
  return (
    <section className="section-padding border-t border-stone-100 bg-stone-50">
      <div className="container-max">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo-dg.png" alt="Decorgrass" width={40} height={40} className="h-10 w-10 rounded-lg" />
          <h2 className="text-2xl font-bold text-stone-900">Proyecto realizado por Decorgrass</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-2xl font-bold text-brand-primary">{s.stat}</p>
              <p className="mt-1 text-sm text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
