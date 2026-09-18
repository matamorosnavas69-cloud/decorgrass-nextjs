import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Decorgrass — Grama Sintética Premium",
    short_name: "Decorgrass",
    description: "Especialistas en grama sintética de alta calidad en Colombia. Cotiza tu proyecto hoy.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2E7D32",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/logo-dg.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Cotizador",
        short_name: "Cotizar",
        description: "Calcula el precio de tu proyecto",
        url: "/cotizador",
      },
      {
        name: "Catálogo",
        short_name: "Catálogo",
        description: "Ver todos los productos",
        url: "/catalogo",
      },
    ],
  };
}
