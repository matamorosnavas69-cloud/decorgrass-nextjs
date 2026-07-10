import { products, type GrassProduct, type GrassUse } from "@/app/lib/data";

export async function getAllProducts(): Promise<GrassProduct[]> {
  return products;
}

export async function getFeaturedProducts(): Promise<GrassProduct[]> {
  return products.filter((p) => p.featured && p.available);
}

export async function getProductBySlug(slug: string): Promise<GrassProduct | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByUse(use: GrassUse): Promise<GrassProduct[]> {
  return products.filter((p) => p.uses.includes(use) && p.available);
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<GrassProduct[]> {
  return products
    .filter((p) => p.id !== productId && p.category === category && p.available)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<GrassProduct[]> {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.available &&
      (p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.uses.some((u) => u.includes(q)))
  );
}
