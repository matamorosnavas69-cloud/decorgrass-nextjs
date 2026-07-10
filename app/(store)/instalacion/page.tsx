import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { processSteps } from "@/app/lib/data";
import { getWhatsAppContactURL } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Servicio de Instalación Profesional",
  description:
    "Instalación profesional de grama sintética en toda Colombia. Equipo certificado, garantía incluida y materiales de primera calidad.",
};

const features = [
  "Equipo de instaladores certificados y con experiencia",
  "Preparación del terreno incluida",
  "Materiales y fijaciones de calidad premium",
  "Acabados perfectos en bordes y uniones",
  "Limpieza del área al finalizar",
  "Certificado de instalación y garantía por escrito",
  "Seguimiento post-instalación",
  "Disponibilidad a nivel nacional",
];

export default function InstalacionPage() {
  return (
    <div className="pt-16">
      <div className="bg-grass-gradient px-4 py-20 sm:px-6 lg:px-8 text-center">
        <span className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
          Servicio premium
        </span>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Instalación profesional
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Tu espacio en las mejores manos. Instalamos en toda Colombia con materiales de primera.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/cotizador" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-brand-primary hover:bg-grass-50">
            Cotizar instalación
          </Link>
          <a
            href={getWhatsAppContactURL("Hola, me gustaría más información sobre el servicio de instalación.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-3.5 font-semibold text-white hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Hablar por WhatsApp
          </a>
        </div>
      </div>

      <div className="container-max section-padding">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              ¿Qué incluye nuestro servicio?
            </h2>
            <p className="mt-3 text-stone-500">
              Una instalación completa, sin preocupaciones ni costos ocultos.
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-stone-700">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grass-100">
                    <Check className="h-3 w-3 text-brand-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              El proceso paso a paso
            </h2>
            <div className="mt-6 space-y-4">
              {processSteps.map((step, i) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{step.title}</h3>
                    <p className="text-sm text-stone-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-stone-900">¿Listo para transformar tu espacio?</h2>
          <p className="mt-2 text-stone-500">Solicita tu cotización gratuita en menos de 2 minutos.</p>
          <Link href="/cotizador" className="btn-primary mt-6 inline-flex px-8 py-3.5 text-base">
            Cotizar ahora — Es gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
