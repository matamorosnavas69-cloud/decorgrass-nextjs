import type { Metadata } from "next";
import QuickQuote from "@/app/components/home/QuickQuote";

export const metadata: Metadata = {
  title: "Cotizador de Grama Sintética",
  description:
    "Calcula el costo de tu proyecto de grama sintética. Recibe tu cotización personalizada por WhatsApp en minutos, sin compromiso.",
};

export default function CotizadorPage() {
  return (
    <div className="pt-16">
      <div className="bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-max text-center">
          <span className="badge-green mb-3 inline-block">Gratuito</span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Cotiza tu proyecto
          </h1>
          <p className="mt-3 text-stone-500">
            Completa el formulario y te respondemos por WhatsApp en minutos.
          </p>
        </div>
      </div>
      <QuickQuote />
    </div>
  );
}
