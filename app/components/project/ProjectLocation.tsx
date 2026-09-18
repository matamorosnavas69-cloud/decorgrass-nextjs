import { MapPin } from "lucide-react";

interface ProjectLocationProps {
  location: string;
}

export default function ProjectLocation({ location }: ProjectLocationProps) {
  const mapQuery = encodeURIComponent(`${location}, Colombia`);

  return (
    <section className="section-padding border-t border-stone-100">
      <div className="container-max max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">Ubicación</h2>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-grass-50">
              <MapPin className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">{location}</p>
              <p className="text-sm text-stone-500">Proyecto instalado por el equipo de Decorgrass</p>
            </div>
          </div>
          <iframe
            title={`Mapa de ${location}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
