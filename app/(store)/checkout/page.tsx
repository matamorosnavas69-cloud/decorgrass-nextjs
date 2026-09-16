import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-max max-w-lg px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  );
}
