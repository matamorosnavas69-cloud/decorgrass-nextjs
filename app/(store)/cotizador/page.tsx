import type { Metadata } from "next";
import QuoteWizard from "@/app/components/quote/QuoteWizard";
import { getAllProducts } from "@/app/lib/queries/products";

export const metadata: Metadata = {
  title: "Cotizador de Grama Sintética",
  description:
    "Calcula el costo de tu proyecto de grama sintética. Recibe tu cotización personalizada por WhatsApp en minutos, sin compromiso.",
};

export default async function CotizadorPage() {
  const products = await getAllProducts();

  return (
    <div className="pt-16">
      <div className="section-padding bg-stone-50 px-4 sm:px-6 lg:px-8">
        <QuoteWizard products={products} />
      </div>
    </div>
  );
}
