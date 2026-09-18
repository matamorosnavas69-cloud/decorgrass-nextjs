"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AlertCircle } from "lucide-react";
import { useCart, cartTotal } from "@/app/hooks/useCart";
import { formatCOP } from "@/app/lib/utils";
import { createOrder, type CreateOrderResult } from "@/app/lib/actions/orders";

type PaymentData = Extract<CreateOrderResult, { ok: true }>;

const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const total = cartTotal(items);

  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", customerCity: "", customerAddress: "" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  // El carrito persiste en localStorage (zustand) y solo se conoce después
  // de hidratar en el cliente — en el primer render `items` siempre es []
  // aunque el usuario tenga cosas guardadas. Sin este flag, el guard de
  // abajo redirige a /carrito en CADA carga de /checkout, incluso con
  // carrito lleno.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && items.length === 0 && !payment) router.replace("/carrito");
  }, [hydrated, items.length, payment, router]);

  if (!hydrated || (items.length === 0 && !payment)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await createOrder({
      ...form,
      items: items.map((i) => ({
        productSlug: i.slug,
        squareMeters: i.squareMeters,
        installationNeeded: i.installationNeeded,
      })),
    });

    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPayment(result);
    clear();
  };

  if (payment) {
    if (!payment.signature || !WOMPI_PUBLIC_KEY) {
      return (
        <div className="card p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
          <p className="mt-3 text-sm text-stone-600">
            Tu pedido <strong>{payment.reference}</strong> quedó registrado, pero el pago en línea no está
            configurado todavía. Escríbenos por WhatsApp mencionando ese número de pedido para coordinar el pago.
          </p>
        </div>
      );
    }

    const redirectUrl = `${window.location.origin}/pedido/${payment.reference}`;
    const wompiAttrs: Record<string, string | number> = {
      "data-render": "button",
      "data-public-key": WOMPI_PUBLIC_KEY,
      "data-currency": payment.currency,
      "data-amount-in-cents": payment.amountInCents,
      "data-reference": payment.reference,
      "data-signature:integrity": payment.signature,
      "data-redirect-url": redirectUrl,
    };

    return (
      <div className="card p-6 text-center">
        <p className="mb-1 text-sm text-stone-500">Pedido</p>
        <p className="mb-4 font-mono text-sm font-semibold text-stone-900">{payment.reference}</p>
        <p className="mb-5 text-2xl font-bold text-brand-primary">{formatCOP(payment.amountInCents / 100)}</p>
        <form>
          <Script key={payment.reference} src="https://checkout.wompi.co/widget.js" strategy="afterInteractive" {...wompiAttrs} />
        </form>
        <p className="mt-4 text-xs text-stone-400">Vas a ser redirigido a Wompi para completar el pago de forma segura.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      {error && (
        <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <div>
        <label className="label-field">Nombre completo</label>
        <input
          required
          value={form.customerName}
          onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
          className="input-field"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Teléfono</label>
          <input
            required
            type="tel"
            value={form.customerPhone}
            onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input
            required
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
            className="input-field"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Ciudad</label>
          <input
            required
            value={form.customerCity}
            onChange={(e) => setForm((f) => ({ ...f, customerCity: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Dirección de instalación</label>
          <input
            required
            value={form.customerAddress}
            onChange={(e) => setForm((f) => ({ ...f, customerAddress: e.target.value }))}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="text-sm text-stone-500">Total a pagar</span>
        <span className="text-xl font-bold text-brand-primary">{formatCOP(total)}</span>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? "Creando pedido..." : "Continuar al pago"}
      </button>
    </form>
  );
}
