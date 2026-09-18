import type { Metadata } from "next";
import { getAllProducts } from "@/app/lib/queries/products";
import CatalogClient from "@/app/components/catalog/CatalogClient";
import CatalogHero from "@/app/components/catalog/CatalogHero";

export const metadata: Metadata = {
  title: "Catálogo de Grama Sintética",
  description:
    "Explora nuestro catálogo completo de grama sintética: decorativa, deportiva, pet friendly y más. Filtra por uso, precio y características.",
};

interface PageProps {
  searchParams: Promise<{ uso?: string; categoria?: string }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const { uso, categoria } = await searchParams;
  const products = await getAllProducts();

  return (
    <div className="pt-16">
      <CatalogHero />
      <CatalogClient products={products} initialUse={uso} initialCategory={categoria} />
    </div>
  );
}
