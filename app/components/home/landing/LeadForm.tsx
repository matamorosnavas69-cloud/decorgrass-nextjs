"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { createLandingLead } from "@/app/lib/actions/leads";
import { buildWhatsAppURL } from "@/app/lib/utils";
import {
  LANDING_INTERESTS,
  landingLeadSchema,
  type LandingLeadInput,
} from "@/app/lib/validations/lead";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LeadForm() {
  const [sent, setSent] = useState<LandingLeadInput | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LandingLeadInput>({
    resolver: zodResolver(landingLeadSchema),
    defaultValues: { interest: LANDING_INTERESTS[0], consent: false },
  });

  const onSubmit = (data: LandingLeadInput) =>
    startTransition(async () => {
      setSubmitError(null);
      const result = await createLandingLead(data);
      if (result.ok) setSent(data);
      else setSubmitError(result.error);
    });

  // El lead ya quedó guardado; WhatsApp es un enlace visible y no un window.open
  // tras el await, que los navegadores bloquean como pop-up.
  if (sent) {
    return (
      <div role="status" className="flex flex-col gap-5">
        <h3 className="text-2xl font-normal tracking-tight">Recibimos tu solicitud</h3>
        <p className="leading-relaxed text-[#37524c]">
          Un asesor te contactará al WhatsApp que dejaste. Si prefieres, escríbenos ahora con los
          datos de tu proyecto.
        </p>
        <a
          href={buildWhatsAppURL({
            name: sent.name,
            city: sent.city,
            productName: sent.interest,
            squareMeters: sent.squareMeters,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hero-dark"
          data-track="whatsapp_click"
          data-section="contacto-formulario"
        >
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
          Continuar en WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6" data-track="lead_form">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="lead-name" label="Nombre" error={errors.name?.message}>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            className="field-line"
            {...register("name")}
          />
        </Field>
        <Field id="lead-phone" label="WhatsApp" error={errors.phone?.message}>
          <input
            id="lead-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+57"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "lead-phone-error" : undefined}
            className="field-line"
            {...register("phone")}
          />
        </Field>
      </div>

      <Field id="lead-interest" label="Producto de interés" error={errors.interest?.message}>
        <select id="lead-interest" className="field-line" {...register("interest")}>
          {LANDING_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="lead-city" label="Ciudad" error={errors.city?.message}>
          <input
            id="lead-city"
            type="text"
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "lead-city-error" : undefined}
            className="field-line"
            {...register("city")}
          />
        </Field>
        <Field id="lead-m2" label="Metros cuadrados (aprox.)" error={errors.squareMeters?.message}>
          <input
            id="lead-m2"
            type="number"
            min={1}
            inputMode="decimal"
            placeholder="Ej: 25"
            aria-invalid={!!errors.squareMeters}
            aria-describedby={errors.squareMeters ? "lead-m2-error" : undefined}
            className="field-line"
            {...register("squareMeters", {
              setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
            })}
          />
        </Field>
      </div>

      {/* honeypot: invisible para personas, tentador para bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <div>
        <label htmlFor="lead-consent" className="flex items-start gap-3 text-[13px] leading-normal text-[#37524c]">
          <input
            id="lead-consent"
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "lead-consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand-primary"
            {...register("consent")}
          />
          Autorizo el tratamiento de mis datos para recibir la cotización.
        </label>
        {errors.consent && (
          <p id="lead-consent-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-hero-dark min-h-[56px] w-full">
        {pending ? "Enviando…" : "Solicitar cotización"}
      </button>
    </form>
  );
}
