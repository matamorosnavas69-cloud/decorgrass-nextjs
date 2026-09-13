import { z } from "zod";

// Campos de lista libre (imágenes, beneficios, colores, alturas, usos) se
// escriben uno por línea en un textarea — más simple que un editor de
// arrays dedicado, suficiente para el MVP del admin.
const lines = (raw: FormDataEntryValue | null) =>
  String(raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug requerido")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug inválido: solo minúsculas, números y guiones"),
  category: z.string().trim().min(1, "Categoría requerida"),
  description: z.string().trim().min(10, "Descripción requerida"),
  shortDescription: z.string().trim().min(5, "Descripción corta requerida"),
  pricePerM2: z.coerce.number().positive("El precio debe ser mayor a 0"),
  fiberHeight: z.string().trim().min(1, "Altura de fibra requerida"),
  density: z.string().trim().min(1, "Densidad requerida"),
  toneColor: z.string().trim().min(1, "Tono de color requerido"),
  guarantee: z.string().trim().min(1, "Garantía requerida"),
  badge: z.string().trim().optional().or(z.literal("")),
  badgeType: z.enum(["green", "amber", "stone", ""]).optional(),
  petFriendly: z.coerce.boolean(),
  childFriendly: z.coerce.boolean(),
  sportSuitable: z.coerce.boolean(),
  available: z.coerce.boolean(),
  featured: z.coerce.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function parseProductForm(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    pricePerM2: formData.get("pricePerM2"),
    fiberHeight: formData.get("fiberHeight"),
    density: formData.get("density"),
    toneColor: formData.get("toneColor"),
    guarantee: formData.get("guarantee"),
    badge: formData.get("badge"),
    badgeType: formData.get("badgeType"),
    petFriendly: formData.get("petFriendly") === "on",
    childFriendly: formData.get("childFriendly") === "on",
    sportSuitable: formData.get("sportSuitable") === "on",
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
  };

  const parsed = productFormSchema.safeParse(raw);
  const arrays = {
    images: lines(formData.get("images")),
    uses: lines(formData.get("uses")),
    availableColors: lines(formData.get("availableColors")),
    availableHeights: lines(formData.get("availableHeights")),
    benefits: lines(formData.get("benefits")),
  };

  return { parsed, arrays };
}
