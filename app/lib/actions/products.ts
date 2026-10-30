"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { requirePermission } from "@/app/lib/authz";
import { parseProductForm } from "@/app/lib/validations/product";

export type ProductFormState = { error?: string };

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requirePermission("products:write");
  const { parsed, arrays } = parseProductForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data;

  const existing = await prisma.grassProduct.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "Ya existe un producto con ese slug" };

  const product = await prisma.grassProduct.create({
    data: {
      ...data,
      badge: data.badge || null,
      badgeType: data.badgeType || null,
      ...arrays,
    },
  });

  revalidatePath("/dashboard/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  redirect("/dashboard/productos");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission("products:write");
  const { parsed, arrays } = parseProductForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data;

  const existing = await prisma.grassProduct.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) return { error: "Ya existe otro producto con ese slug" };

  const product = await prisma.grassProduct.update({
    where: { id },
    data: {
      ...data,
      badge: data.badge || null,
      badgeType: data.badgeType || null,
      ...arrays,
    },
  });

  revalidatePath("/dashboard/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  redirect("/dashboard/productos");
}

/** Marca agotado/disponible en vez de borrar — más seguro para el catálogo público. */
export async function toggleProductAvailability(id: string): Promise<void> {
  await requirePermission("products:write");
  const product = await prisma.grassProduct.findUniqueOrThrow({ where: { id } });
  await prisma.grassProduct.update({ where: { id }, data: { available: !product.available } });

  revalidatePath("/dashboard/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
}
