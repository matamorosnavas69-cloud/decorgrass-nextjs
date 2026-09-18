import { z } from "zod";

// Mismo enfoque que app/lib/validations/product.ts: los campos de lista
// libre (imágenes antes/después, tags, logros) se escriben uno por línea.
const lines = (raw: FormDataEntryValue | null) =>
  String(raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const projectFormSchema = z.object({
  title: z.string().trim().min(2, "Título requerido"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug requerido")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug inválido: solo minúsculas, números y guiones"),
  category: z.string().trim().min(1, "Categoría requerida"),
  description: z.string().trim().min(10, "Descripción requerida"),
  location: z.string().trim().min(1, "Ubicación requerida"),
  metersInstalled: z.coerce.number().positive("Los metros instalados deben ser mayores a 0"),
  grassUsed: z.string().trim().min(1, "Producto usado requerido"),
  grassColor: z.string().trim().min(1, "Color requerido"),
  installationTime: z.string().trim().min(1, "Tiempo de instalación requerido"),
  warranty: z.string().trim().min(1, "Garantía requerida"),
  published: z.coerce.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function parseProjectForm(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
    location: formData.get("location"),
    metersInstalled: formData.get("metersInstalled"),
    grassUsed: formData.get("grassUsed"),
    grassColor: formData.get("grassColor"),
    installationTime: formData.get("installationTime"),
    warranty: formData.get("warranty"),
    published: formData.get("published") === "on",
  };

  const parsed = projectFormSchema.safeParse(raw);
  const arrays = {
    beforeImages: lines(formData.get("beforeImages")),
    afterImages: lines(formData.get("afterImages")),
    tags: lines(formData.get("tags")),
    benefits: lines(formData.get("benefits")),
  };

  return { parsed, arrays };
}
