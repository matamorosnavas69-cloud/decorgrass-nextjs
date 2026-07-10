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
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
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
        icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }],
      },
      {
        name: "Catálogo",
        short_name: "Catálogo",
        description: "Ver todos los productos",
        url: "/catalogo",
        icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }],
      },
    ],
  };
}
