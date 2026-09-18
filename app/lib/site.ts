// URL base del sitio en producción. Un solo lugar para cambiarla si el
// dominio final no es decorgrass.com — evita editar metadataBase, robots.ts
// y sitemap.ts por separado cada vez.
export const SITE_URL = process.env.SITE_URL ?? "https://decorgrass.com";
