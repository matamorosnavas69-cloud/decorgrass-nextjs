# DecorGrass

E-commerce B2B de grama sintética. Next.js 16 (App Router) + Prisma + PostgreSQL + Tailwind v3 + Zustand.

## Requisitos

- Node.js 18+
- PostgreSQL

## Setup

```bash
npm install
cp .env.example .env   # completa DATABASE_URL
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `app/(store)/` — sitio público: catálogo, producto, cotizador, instalación, proyectos, nosotros, contacto
- `app/dashboard/` — panel de administración
- `app/components/` — componentes por dominio (catalog, home, product, projects, quote, layout, ui)
- `app/lib/` — lógica compartida, `app/lib/queries/` — queries de Prisma
- `prisma/schema.prisma` — modelo `GrassProduct` (SEO, imágenes, categorías)

No usa autenticación externa (Clerk, etc.) — solo formulario básico de contacto.
