"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppURL } from "@/app/lib/utils";
import { createContactLead } from "@/app/lib/actions/leads";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  phone: z.string().min(7, "Teléfono válido requerido"),
  spaceType: z.string().min(1, "Selecciona un tipo"),
  message: z.string().min(10, "Cuéntanos más sobre tu proyecto"),
  company: z.string().optional(), // honeypot: cualquier valor es válido aquí, se descarta en el servidor
});

type FormData = z.infer<typeof schema>;

const projectTypes = [
  "Jardín residencial",
  "Terraza / Balcón",
  "Zona infantil",
  "Espacio pet friendly",
  "Cancha deportiva",
  "Zona comercial / empresarial",
  "Otro",
];

export default function ContactoPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = (data: FormData) => {
    const url = buildWhatsAppURL({
      name: data.name,
      phone: data.phone,
      spaceType: data.spaceType,
      message: data.message,
    });

    startTransition(async () => {
      const result = await createContactLead(data);
      setStatus(result.ok ? "success" : "error");
      if (result.ok) reset();
      window.open(url, "_blank");
    });
  };

  return (
    <div className="pt-16">
      <div className="bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-max">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Contacto</h1>
          <p className="mt-3 text-stone-500">
            Estamos listos para ayudarte con tu proyecto.
          </p>
        </div>
      </div>

      <div className="container-max section-padding">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-6 text-xl font-semibold text-stone-900">
              Escríbenos sobre tu proyecto
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label-field">Nombre</label>
                <input type="text" placeholder="Tu nombre" {...register("name")} className="input-field" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label-field">Teléfono / WhatsApp</label>
                <input type="tel" placeholder="+57 300 000 0000" {...register("phone")} className="input-field" />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="label-field">Tipo de proyecto</label>
                <select {...register("spaceType")} className="input-field">
                  <option value="">Seleccionar...</option>
                  {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.spaceType && <p className="mt-1 text-xs text-red-500">{errors.spaceType.message}</p>}
              </div>
              <div>
                <label className="label-field">Cuéntanos tu proyecto</label>
                <textarea
                  rows={4}
                  placeholder="Describe el espacio, medidas aproximadas, ciudad..."
                  {...register("message")}
                  className="input-field resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              {/* Honeypot anti-spam: invisible para personas, los bots lo autocompletan */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <button type="submit" disabled={isPending} className="btn-whatsapp w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-60">
                <MessageCircle className="h-5 w-5" />
                {isPending ? "Enviando..." : "Enviar por WhatsApp"}
              </button>

              {status === "success" && (
                <p className="flex items-center gap-1.5 text-sm text-brand-primary">
                  <CheckCircle2 className="h-4 w-4" /> Mensaje registrado. Te contactaremos pronto.
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-1.5 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" /> No pudimos guardar tu mensaje, pero puedes continuar por WhatsApp.
                </p>
              )}
            </form>
          </motion.div>

          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-stone-900">Información de contacto</h2>
            <div className="card p-5 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">WhatsApp</p>
                <p className="text-sm text-stone-500">+57 320 852 3041</p>
                <p className="mt-1 text-xs text-stone-400">Canal principal de atención</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grass-100">
                <MapPin className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">Cobertura</p>
                <p className="text-sm text-stone-500">Colombia</p>
                <p className="mt-1 text-xs text-stone-400">Principales ciudades</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100">
                <Clock className="h-5 w-5 text-stone-500" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">Horario de atención</p>
                <p className="text-sm text-stone-500">Lunes a sábado: 7am – 6pm</p>
                <p className="mt-1 text-xs text-stone-400">Respondemos por WhatsApp en minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
