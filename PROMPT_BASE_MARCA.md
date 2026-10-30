# Prompt base para replicar DecorGrass en otra marca

Reemplaza lo que está entre `[ ]`. Reconstruido desde el código real de decorgrass/ (el prompt original no está guardado en el repo).

```text
Construye el sitio web de [MARCA], empresa de [RUBRO] en [PAÍS/CIUDAD].
Modelo de negocio: catálogo + cotizador + captación de leads (NO e-commerce
transaccional: sin carrito, checkout ni pagos). El cierre comercial ocurre
por WhatsApp.

STACK (obligatorio)
- Next.js 16 App Router + React 19 + TypeScript estricto (sin `any`)
- Tailwind CSS v3, framer-motion, lucide-react, Zustand (solo UI/wishlist)
- Prisma 7 + PostgreSQL (@prisma/adapter-pg)
- Zod 4 + react-hook-form en todos los formularios
- Resend para emails, jose + bcryptjs para auth admin
- Tests con el runner nativo: `tsx --test`
- Antes de escribir código, lee node_modules/next/dist/docs/: Next 16 tiene
  breaking changes (middleware.ts ahora es proxy.ts; `next lint` no existe).

PÁGINAS PÚBLICAS  app/(store)/
home, catalogo, producto/[slug], cotizador, proyectos, proyectos/[slug],
instalacion, nosotros, contacto. Server Components para leer datos
(app/lib/queries/*), Client Components solo donde haya interactividad.
Cada ruta de datos con loading.tsx y error.tsx.

MODELOS PRISMA
[Producto] (slug único, imágenes String[], precio, disponible, campos SEO),
Project (slug único, published), Lead (status NEW/CONTACTED/QUOTED/CLOSED/LOST,
notes, productId opcional con @@index), Review, Subscriber.

COTIZADOR: wizard de 4 pasos (espacio -> medidas -> producto -> contacto).
El precio se RECALCULA en el servidor desde la BD; nunca confiar en el
total del cliente. Guarda el Lead, envía email y abre un enlace wa.me.

BACKEND: sin API routes; todo con Server Actions ("use server") en
app/lib/actions/. Cada acción valida con Zod (app/lib/validations/) y
devuelve {ok, error}. Formularios públicos con honeypot Y rate limiting.

ADMIN  app/dashboard/: CRUD de productos, proyectos y leads.
Protegido con proxy.ts (cookie JWT con jose) y requireAdmin() dentro de
CADA Server Action mutante. Sin credenciales de respaldo: si faltan
AUTH_SECRET/ADMIN_EMAIL/ADMIN_PASSWORD_HASH, la app NO arranca en producción.

SEO: metadata por página, canonical, imagen Open Graph, sitemap.ts,
robots.ts, JSON-LD (Product, LocalBusiness) y noindex en el dashboard.

MARCA: color primario [#HEX], tipografías [X/Y], logo [ruta], tono [ ].
Textos reales en español, sin lorem ipsum. Responsive mobile-first.

TRABAJA POR FASES, y al terminar cada una verifica con `npm run lint`,
`npm run typecheck` y `npm test`:
 1. BD + queries reales (seed con productos de [MARCA])
 2. Server Actions + validación + persistencia de leads
 3. Auth del dashboard + CRUD
 4. Calidad: tests, ESLint (flat config), loading/error states
 5. Emails (Resend) + docs/LAUNCH_CHECKLIST.md con variables de entorno

Documenta en docs/IMPLEMENTATION_PLAN.md el estado verificado en código,
no asumido. Marca con "// ponytail:" cada simplificación deliberada.
```
