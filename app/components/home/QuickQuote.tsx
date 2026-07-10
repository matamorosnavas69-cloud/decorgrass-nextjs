"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppURL, calculateQuote, formatCOP } from "@/app/lib/utils";

const schema = z.object({
  spaceType: z.string().min(1, "Selecciona el tipo de espacio"),
  squareMeters: z
    .string()
    .min(1, "Indica los metros cuadrados")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 10000, "Entre 1 y 10.000 m²"),
  city: z.string().min(2, "Indica tu ciudad"),
  installationNeeded: z.enum(["si", "no"]),
  name: z.string().min(2, "Tu nombre es requerido"),
  phone: z.string().min(7, "Número de teléfono válido"),
});

type FormData = z.infer<typeof schema>;

const spaceTypes = [
  "Jardín residencial",
  "Terraza / Balcón",
  "Zona infantil",
  "Espacio pet friendly",
  "Cancha deportiva",
  "Zona comercial",
  "Otro",
];

export default function QuickQuote() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { installationNeeded: "si" },
  });

  const m2 = parseFloat(watch("squareMeters") ?? "0") || 0;
  const estimate = m2 > 0 ? calculateQuote(m2, 50000, watch("installationNeeded") === "si") : null;

  const onSubmit = (data: FormData) => {
    const url = buildWhatsAppURL({
      name: data.name,
      phone: data.phone,
      spaceType: data.spaceType,
      squareMeters: Number(data.squareMeters),
      city: data.city,
      installationNeeded: data.installationNeeded === "si",
      totalPrice: estimate?.grandTotal,
    });
    window.open(url, "_blank");
  };

  return (
    <section className="section-padding bg-grass-gradient">
      <div className="container-max">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
              <MessageCircle className="h-4 w-4" />
              Respuesta inmediata
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Cotiza tu proyecto gratis
            </h2>
            <p className="mt-3 text-white/80">
              Completa el formulario y recibe tu cotización por WhatsApp en minutos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-field">Tipo de espacio</label>
                  <select {...register("spaceType")} className="input-field">
                    <option value="">Seleccionar...</option>
                    {spaceTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.spaceType && <p className="mt-1 text-xs text-red-500">{errors.spaceType.message}</p>}
                </div>

                <div>
                  <label className="label-field">Metros cuadrados (aprox.)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 25"
                    {...register("squareMeters")}
                    className="input-field"
                  />
                  {errors.squareMeters && <p className="mt-1 text-xs text-red-500">{errors.squareMeters.message}</p>}
                </div>

                <div>
                  <label className="label-field">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Tu ciudad"
                    {...register("city")}
                    className="input-field"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="label-field">¿Requiere instalación?</label>
                  <div className="flex gap-3 pt-1">
                    {["si", "no"].map((v) => (
                      <label key={v} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-stone-200 px-4 py-2.5 text-sm font-medium transition-all has-[:checked]:border-brand-primary has-[:checked]:bg-grass-50 has-[:checked]:text-brand-primary">
                        <input type="radio" value={v} {...register("installationNeeded")} className="sr-only" />
                        {v === "si" ? "Sí" : "No"}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-field">Tu nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    {...register("name")}
                    className="input-field"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label-field">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+57 300 000 0000"
                    {...register("phone")}
                    className="input-field"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Estimate preview */}
              {estimate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-grass-50 border border-grass-200 p-4"
                >
                  <p className="mb-2 text-xs font-semibold text-grass-700 uppercase tracking-wide">
                    Estimado orientativo
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-stone-500">Material:</span>{" "}
                      <strong>{formatCOP(estimate.materialTotal)}</strong>
                    </div>
                    {estimate.installationTotal > 0 && (
                      <div>
                        <span className="text-stone-500">Instalación:</span>{" "}
                        <strong>{formatCOP(estimate.installationTotal)}</strong>
                      </div>
                    )}
                    <div>
                      <span className="text-stone-500">Total aprox.:</span>{" "}
                      <strong className="text-brand-primary">{formatCOP(estimate.grandTotal)}</strong>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-stone-400">*Precio varía según producto seleccionado</p>
                </motion.div>
              )}

              <button type="submit" className="btn-whatsapp w-full py-4 text-base">
                <MessageCircle className="h-5 w-5" />
                Recibir cotización por WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
