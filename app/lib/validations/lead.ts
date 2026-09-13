import { z } from "zod";

// honeypot: campo oculto al usuario real; si llega lleno, es un bot.
// Debe aceptar CUALQUIER valor aquí — la decisión de ignorar el envío vive
// en la Server Action (createQuoteLead/createContactLead), no en el schema.
// Si esto rechazara strings no vacíos, un bot haría fallar la validación
// antes de llegar a esa lógica, delatando el honeypot en vez de ignorarlo.
const honeypot = z.string().optional();

export const quoteLeadSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  phone: z.string().trim().min(7, "Teléfono válido requerido"),
  city: z.string().trim().min(1, "Ciudad requerida"),
  spaceType: z.string().trim().min(1, "Tipo de espacio requerido"),
  squareMeters: z.number().positive("Los metros cuadrados deben ser mayores a 0"),
  productSlug: z.string().trim().min(1, "Selecciona un producto"),
  installationNeeded: z.boolean(),
  company: honeypot,
});

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  phone: z.string().trim().min(7, "Teléfono válido requerido"),
  spaceType: z.string().trim().min(1, "Selecciona un tipo"),
  message: z.string().trim().min(10, "Cuéntanos más sobre tu proyecto"),
  company: honeypot,
});

export type QuoteLeadInput = z.infer<typeof quoteLeadSchema>;
export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
