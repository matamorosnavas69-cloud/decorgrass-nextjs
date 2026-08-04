import type { Metadata } from "next";
import QuoteWizard from "@/app/components/quote/QuoteWizard";

export const metadata: Metadata = {
  title: "Cotizador de Grama Sintética",
  description:
    "Calcula el costo de tu proyecto de grama sintética. Recibe tu cotización personalizada por WhatsApp en minutos, sin compromiso.",
};

export default function CotizadorPage() {
  return (
    <div className="pt-16">
      <div className="section-padding bg-stone-50 px-4 sm:px-6 lg:px-8">
        <QuoteWizard />
      </div>
    </div>
  );
}
