import { z } from "zod";

// El carrito viaja del cliente al servidor solo como slug + m² + instalación.
// El precio NUNCA viaja del cliente — se recalcula server-side contra el
// catálogo real en createOrder, mismo principio que ya usa createQuoteLead.
export const cartItemInputSchema = z.object({
  productSlug: z.string().trim().min(1),
  squareMeters: z.number().positive("Los metros cuadrados deben ser mayores a 0"),
  installationNeeded: z.boolean(),
});

export const checkoutFormSchema = z.object({
  customerName: z.string().trim().min(2, "Nombre requerido"),
  customerPhone: z.string().trim().min(7, "Teléfono válido requerido"),
  customerEmail: z.string().trim().email("Email inválido"),
  customerCity: z.string().trim().min(1, "Ciudad requerida"),
  customerAddress: z.string().trim().min(5, "Dirección requerida"),
  items: z.array(cartItemInputSchema).min(1, "El carrito está vacío"),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
