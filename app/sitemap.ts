import type { MetadataRoute } from "next";
import { getAllProducts } from "@/app/lib/queries/products";
import { getAllProjects } from "@/app/lib/queries/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://decorgrass.com";
  const [products, projects] = await Promise.all([getAllProducts(), getAllProjects()]);

  const staticPages = [
    { url: base, priority: 1.0 },
    { url: `${base}/catalogo`, priority: 0.9 },
    { url: `${base}/cotizador`, priority: 0.9 },
    { url: `${base}/proyectos`, priority: 0.8 },
    { url: `${base}/instalacion`, priority: 0.8 },
    { url: `${base}/nosotros`, priority: 0.6 },
    { url: `${base}/contacto`, priority: 0.7 },
  ].map((p) => ({ ...p, lastModified: new Date(), changeFrequency: "weekly" as const }));

  const productPages = products.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectPages = projects.map((p) => ({
    url: `${base}/proyectos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...projectPages];
}
