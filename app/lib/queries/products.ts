import { prisma } from "@/app/lib/db";
import type { GrassProduct, GrassCategory, GrassUse } from "@/app/lib/data";
import type { GrassProduct as PrismaGrassProduct } from "@prisma/client";

// El schema guarda category/uses/badgeType como string llano; el frontend
// sigue tipándolos como uniones (GrassCategory/GrassUse) porque el propio
// admin (fase 3) es el único que escribe estos valores y los restringe.
function toGrassProduct(row: PrismaGrassProduct): GrassProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.shortDescription,
    category: row.category as GrassCategory,
    uses: row.uses as GrassUse[],
    pricePerM2: row.pricePerM2,
    fiberHeight: row.fiberHeight,
    density: row.density,
    toneColor: row.toneColor,
    availableHeights: row.availableHeights,
    availableColors: row.availableColors,
    guarantee: row.guarantee,
    badge: row.badge ?? undefined,
    badgeType: (row.badgeType as GrassProduct["badgeType"]) ?? undefined,
    petFriendly: row.petFriendly,
    childFriendly: row.childFriendly,
    sportSuitable: row.sportSuitable,
    benefits: row.benefits,
    images: row.images,
    available: row.available,
    featured: row.featured,
  };
}

export async function getAllProducts(): Promise<GrassProduct[]> {
  const rows = await prisma.grassProduct.findMany({ orderBy: { name: "asc" } });
  return rows.map(toGrassProduct);
}

export async function getFeaturedProducts(): Promise<GrassProduct[]> {
  const rows = await prisma.grassProduct.findMany({
    where: { featured: true, available: true },
    orderBy: { name: "asc" },
  });
  return rows.map(toGrassProduct);
}

export async function getProductBySlug(slug: string): Promise<GrassProduct | null> {
  const row = await prisma.grassProduct.findUnique({ where: { slug } });
  return row ? toGrassProduct(row) : null;
}

export async function getProductsByUse(use: GrassUse): Promise<GrassProduct[]> {
  const rows = await prisma.grassProduct.findMany({
    where: { available: true, uses: { has: use } },
    orderBy: { name: "asc" },
  });
  return rows.map(toGrassProduct);
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<GrassProduct[]> {
  const rows = await prisma.grassProduct.findMany({
    where: { id: { not: productId }, category, available: true },
    take: limit,
    orderBy: { name: "asc" },
  });
  return rows.map(toGrassProduct);
}

export async function searchProducts(query: string): Promise<GrassProduct[]> {
  const rows = await prisma.grassProduct.findMany({
    where: {
      available: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
  });
  return rows.map(toGrassProduct);
}
