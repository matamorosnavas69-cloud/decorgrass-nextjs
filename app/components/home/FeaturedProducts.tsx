import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/app/lib/queries/products";
import ProductCard from "@/app/components/ui/ProductCard";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="badge-green mb-3 inline-block">Catálogo</span>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Productos destacados
            </h2>
            <p className="mt-2 text-stone-500">
              Los más elegidos por nuestros clientes.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="hidden items-center gap-1.5 text-sm font-medium text-brand-primary transition-colors hover:text-brand-dark sm:flex"
          >
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/catalogo" className="btn-secondary gap-2">
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
