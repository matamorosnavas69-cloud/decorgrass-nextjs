import { MessageCircle } from "lucide-react";
import { getWhatsAppContactURL } from "@/app/lib/utils";

interface ProjectCTAProps {
  title: string;
}

export default function ProjectCTA({ title }: ProjectCTAProps) {
  const whatsappURL = getWhatsAppContactURL(
    `Hola, vi el proyecto "${title}" y me gustaría algo similar para mi espacio.`
  );

  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="rounded-2xl bg-grass-gradient p-10 text-center sm:p-14">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Quieres algo similar?</h2>
          <p className="mt-2 text-white/80">Cuéntanos tu idea y te ayudamos a hacerla realidad.</p>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-primary hover:bg-grass-50"
          >
            <MessageCircle className="h-5 w-5" />
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
