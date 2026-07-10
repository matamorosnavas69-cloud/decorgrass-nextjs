import type { Metadata } from "next";
import { getAllProducts } from "@/app/lib/queries/products";
import CatalogClient from "@/app/components/catalog/CatalogClient";

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
      <div className="bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-max">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Catálogo de grama sintética
          </h1>
          <p className="mt-3 text-stone-500">
            Encuentra la grama perfecta para tu espacio.
          </p>
        </div>
      </div>
      <CatalogClient products={products} initialUse={uso} initialCategory={categoria} />
    </div>
  );
}
