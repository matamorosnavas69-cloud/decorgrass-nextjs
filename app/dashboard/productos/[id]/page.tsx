import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { getProductBySlug } from "@/app/lib/queries/products";
import { updateProduct } from "@/app/lib/actions/products";
import ProductForm from "../ProductForm";

export const metadata: Metadata = { title: "Editar producto — Dashboard" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params;
  const row = await prisma.grassProduct.findUnique({ where: { id } });
  if (!row) notFound();
  const product = await getProductBySlug(row.slug);
  if (!product) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/productos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Editar {product.name}</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <ProductForm product={product} action={updateProduct.bind(null, id)} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
