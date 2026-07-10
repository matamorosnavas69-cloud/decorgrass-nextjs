import { getRelatedProducts } from "@/app/lib/queries/products";
import ProductCard from "@/app/components/ui/ProductCard";

interface RelatedProductsProps {
  productId: string;
  category: string;
}

export default async function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const products = await getRelatedProducts(productId, category);

  if (products.length === 0) return null;

  return (
    <section className="section-padding border-t border-stone-100 bg-stone-50">
      <div className="container-max">
        <h2 className="mb-8 text-2xl font-bold text-stone-900">
          Productos relacionados
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
