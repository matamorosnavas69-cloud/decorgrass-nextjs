import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/app/lib/queries/products";
import ProductGallery from "@/app/components/product/ProductGallery";
import ProductDetails from "@/app/components/product/ProductDetails";
import RelatedProducts from "@/app/components/product/RelatedProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} — Grama Sintética`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Decorgrass`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Decorgrass" },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.pricePerM2,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="container-max px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-stone-400">
            <Link href="/" className="hover:text-brand-primary">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/catalogo" className="hover:text-brand-primary">Catálogo</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-stone-700">{product.name}</span>
          </nav>
        </div>

        {/* Product grid */}
        <div className="container-max px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductDetails product={product} />
          </div>
        </div>

        <RelatedProducts productId={product.id} category={product.category} />
      </div>
    </>
  );
}
