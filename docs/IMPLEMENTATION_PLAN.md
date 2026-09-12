# DecorGrass — Plan de implementación (backend real)

> Estado: **FASE 0 — auditoría**, sin cambios de código todavía. Este documento se actualiza al cerrar cada fase.

## 0. Estado actual (verificado en código, no asumido)

Re-inspeccioné el repo directamente (no confié en el diagnóstico previo) el 12 sep 2026. Confirmado, línea por línea, contra lo que había en el diagnóstico anterior — **sigue siendo exacto**, sin diferencias:

- `app/api/` **no existe**. Cero rutas de API.
- Cero directivas `'use server'` en todo `app/` (grep vacío).
- Cero imports de `@prisma/client` dentro de `app/` (grep vacío). Prisma solo corre en `prisma/seed.ts`.
- `app/lib/queries/products.ts` y `projects.ts` son wrappers `async` sobre el array literal de `app/lib/data.ts` (1.469 líneas) — no tocan la base de datos.
- `app/dashboard/` tiene exactamente 2 archivos: `layout.tsx` (sidebar con 6 enlaces) y `page.tsx` (stats + 3 leads hardcodeados en el JSX + tabla de productos leída de `data.ts`). El propio código dice *"Datos de ejemplo · Conecta PostgreSQL para datos reales"* y *"Configura DATABASE_URL... para activar almacenamiento de leads"*.
- 7 rutas enlazadas desde el dashboard no tienen archivo: `/dashboard/leads`, `/productos`, `/proyectos`, `/clientes`, `/ajustes`, `/productos/nuevo`, `/proyectos/nuevo`.
- No hay `middleware.ts` ni `proxy.ts`. Sin autenticación de ningún tipo — `/dashboard` es público de hecho (solo `robots.ts` lo desindexa).
- `QuoteWizard.tsx` (432 líneas, componente cliente con `useState` propio) y `contacto/page.tsx` (formulario con react-hook-form + zod) terminan ambos en `window.open(wa.me/...)`. Ninguno llama a un endpoint ni a una Server Action.
- Existe `app/hooks/useQuote.ts`: store de Zustand con `persist` completo para el flujo de cotización, **no usado por `QuoteWizard.tsx`** (que reimplementa el mismo estado con `useState`). Código muerto, no un bug visible.
- `.env` real apunta a una base Neon (Postgres) ya provisionada. `prisma/schema.prisma` tiene 5 modelos + 1 migración aplicada (`20260910040029_init`) — el schema es utilizable tal cual, no requiere rediseño para el MVP.
- No hay ESLint instalado (ni paquete ni config). No hay tests. No hay `error.tsx`/`loading.tsx` en ninguna ruta.
- `package.json` no tiene script `lint`, `typecheck`, `db:migrate` ni `db:studio`.

### Diferencia importante frente al diagnóstico previo: Next.js 16 renombró `middleware` → `proxy`

El diagnóstico original no lo mencionaba porque no llegó a diseñar la autenticación. Verificado en `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`:

> El archivo `middleware.ts` está deprecado, renombrado a `proxy.ts`. El export nombrado `middleware` también está deprecado — la función debe llamarse `proxy`. El runtime `edge` **no** está soportado en `proxy` (el runtime de `proxy` es `nodejs`, fijo).

**Implicación directa para este proyecto:** la protección del dashboard se implementará en **`proxy.ts`** (no `middleware.ts`), con runtime `nodejs` — lo cual además es una ventaja aquí porque `jose`/verificación de JWT corre sin problema en `nodejs` (a diferencia del runtime edge, donde algunas libs de crypto dan problemas).

También relevante para fase 4: `next lint` fue **eliminado** en Next 16 — el script `lint` debe invocar `eslint` directamente, no `next lint`.

## 1. Arquitectura actual (confirmada)

```
app/
├── (store)/            → rutas públicas (Server Components, ya con SSG/generateMetadata)
├── components/         → quote/, product/, catalog/, project/, layout/, ui/, home/
├── dashboard/          → 2 archivos, sin auth, sin CRUD
├── hooks/              → useQuote.ts (sin usar), useUI.ts, useWishlist.ts
├── lib/
│   ├── data.ts          → catálogo hardcodeado (fuente de verdad actual)
│   ├── utils.ts          → formatCOP, buildWhatsAppURL, calculateQuote (server-safe, sin I/O)
│   └── queries/          → products.ts, projects.ts (envoltorios sobre data.ts)
prisma/
├── schema.prisma        → 5 modelos, ya apto para el MVP
├── migrations/           → 1 migración aplicada
└── seed.ts
```

No hay `app/lib/db`, `app/lib/actions`, `app/lib/validations` — se crean en las fases siguientes, siguiendo el patrón ya usado por `app/lib/queries/` (mismo nivel, mismo estilo de export).

## 2. Problemas encontrados (priorizados, sin duplicar el diagnóstico previo)

| # | Problema | Por qué importa |
|---|---|---|
| 1 | Ningún lead se persiste | Cero visibilidad comercial — bloqueante de negocio |
| 2 | Catálogo no editable sin código | Bloquea operación autónoma del equipo |
| 3 | `/dashboard` sin auth | Riesgo de seguridad activo en producción |
| 4 | 7 enlaces del admin a 404 | Rompe la confianza en el propio panel |
| 5 | `useQuote.ts` sin usar | Deuda menor, no bloqueante — se decide en fase 1 si se conecta o se elimina |
| 6 | Sin ESLint/tests/error boundaries | Sin red de seguridad para las fases siguientes |

## 3. Archivos que se modificarán (por fase)

**Fase 1 (leads):**
- `app/components/quote/QuoteWizard.tsx` — agregar llamada a Server Action al enviar (mantener `handleSubmit` de WhatsApp como fallback/complemento, no reemplazo)
- `app/(store)/contacto/page.tsx` — igual, agregar persistencia antes/junto al `window.open`
- `app/hooks/useQuote.ts` — decisión: eliminarlo (no se usa y el wizard ya tiene su propio estado) — se confirma en la fase, no antes

**Fase 2 (catálogo):**
- `app/lib/queries/products.ts`, `app/lib/queries/projects.ts` — reemplazar cuerpo por consultas Prisma, mismo contrato de funciones (cero cambios en los componentes que las consumen)
- `app/lib/data.ts` — se conserva como fuente del script de migración (fase 2), no se borra hasta confirmar paridad de datos

**Fase 3 (admin):**
- `app/dashboard/layout.tsx` — logout real, quitar enlaces sin destino o construir la página
- `app/dashboard/page.tsx` — leer stats reales
- Nuevas rutas bajo `app/dashboard/leads/`, `app/dashboard/productos/`

**Fase 4 (calidad):** cambios transversales de config, sin tocar lógica de negocio.

## 4. Archivos nuevos (por fase)

**Fase 1:**
- `app/lib/db.ts` — cliente Prisma singleton (patrón estándar Next.js: evita agotar conexiones en dev por hot-reload)
- `app/lib/validations/lead.ts` — schemas Zod para cotización y contacto (server-side, no confiar en el del cliente)
- `app/lib/actions/leads.ts` — Server Actions `createQuoteLead`, `createContactLead`

**Fase 2:**
- `prisma/migrate-catalog.ts` — script one-off de migración `data.ts` → Postgres (se documenta y se borra o archiva después de correrlo una vez)

**Fase 3:**
- `app/lib/auth.ts` — sesión de admin (patrón igual al de `sepseven/app/lib/auth.ts`: JWT firmado con `jose` en cookie `httpOnly`, sin librería nueva)
- `proxy.ts` (raíz del proyecto, **no** `middleware.ts` — ver §0) — protege `/dashboard/*`
- `app/(auth)/login/page.tsx` + `app/lib/actions/auth.ts` — login del admin
- `app/dashboard/leads/page.tsx`, `app/dashboard/leads/[id]/actions.ts`
- `app/dashboard/productos/page.tsx`, `app/dashboard/productos/nuevo/page.tsx`, `app/dashboard/productos/[id]/page.tsx`
- `app/lib/actions/products.ts`

**Fase 4:**
- `eslint.config.mjs` (flat config — obligatorio en Next 16, ver §0)
- `app/(store)/catalogo/error.tsx`, `loading.tsx`; mismos en `producto/[slug]` y `dashboard`
- `app/lib/actions/leads.test.ts` (o similar) — smoke test del flujo crítico

## 5. Dependencias necesarias

Todas ya compatibles con el stack fijado (no se cambia Tailwind, no se cambia de ORM):

| Paquete | Fase | Motivo |
|---|---|---|
| `jose` | 3 | JWT de sesión — mismo patrón ya probado en `sepseven` |
| `bcryptjs` | 3 | Hash de la contraseña del admin |
| `eslint`, `eslint-config-next` | 4 | Next 16 quitó `next lint`; hay que instalar ESLint directo |
| `vitest` (o `node --test`, a decidir en fase 4 según lo mínimo viable) | 4 | Smoke tests |

No se agrega Cloudinary, no se agrega NextAuth/Clerk, no se agrega un ORM nuevo, no se sube Tailwind a v4 — todo eso quedaría fuera de alcance del MVP y de las reglas del encargo.

## 6. Orden de implementación

1. **Fase 1 — Leads a Postgres** (prioridad máxima: convierte el sitio en herramienta comercial)
2. **Fase 2 — Catálogo a Postgres** (habilita que fase 3 tenga algo real que administrar)
3. **Fase 3 — Admin real con auth** (depende de 1 y 2: sin datos reales en DB, un CRUD no tiene nada que mostrar)
4. **Fase 4 — Calidad y producción** (se apoya en todo lo anterior para tener algo que testear)

## 7. Riesgos

- **Migración de catálogo (fase 2):** `data.ts` puede tener inconsistencias (rutas de imagen con espacios/HEIC, ya documentado) que se propagarían a Postgres si se migran tal cual. Mitigación: la migración se corre contra una copia/branch de la base primero si Neon lo permite, y se valida conteo + slugs antes de apagar `data.ts` como fuente.
- **Sesión de administrador (fase 3):** al no existir tabla `User`, la autenticación será de admin único (contraseña por variable de entorno + hash), no multiusuario. Es la opción correcta para el alcance del MVP (regla 3 del encargo: no inventar arquitectura) — si en el futuro se necesitan varios admins con roles, se añade un modelo `AdminUser`, pero no ahora.
- **`useQuote.ts`:** eliminarlo es seguro (no tiene consumidores), pero se confirma con un grep final antes de borrar, no antes.
- **Runtime de `proxy.ts`:** al ser siempre `nodejs` (no configurable), cualquier lógica de proxy pesada afecta latencia en todas las rutas que matchee — se limita el `matcher` estrictamente a `/dashboard/:path*`.

## 8. Criterios de aceptación (por fase, resumen — el detalle completo vive en la sección 11 del encargo)

- **Fase 1:** una cotización real y un contacto real aparecen como filas en la tabla `Lead` de Postgres (verificable con `npm run db:studio` si se agrega, o `psql`); WhatsApp sigue abriendo.
- **Fase 2:** `/catalogo` y `/producto/[slug]` muestran los mismos productos que hoy, pero leídos de Postgres; SSG y SEO no se rompen (mismo `generateStaticParams`/`generateMetadata`).
- **Fase 3:** navegar a `/dashboard` sin sesión redirige a `/login`; con sesión, se ve al menos un lead real y se puede cambiar su estado; los 7 enlaces rotos ya no lo están.
- **Fase 4:** `npm run build`, `npm run lint` y `npm run typecheck` pasan sin errores bloqueantes.

---

## Preguntas bloqueantes antes de arrancar Fase 1

1. **Notificación de leads nuevos:** ¿el equipo comercial quiere un email (¿a qué dirección/con qué proveedor — Resend, SMTP propio?) o alcanza con revisar el panel manualmente en el MVP? Esto define si fase 1 incluye envío de email o queda solo en base de datos + panel.
2. **Credencial de admin (fase 3):** ¿un solo usuario admin (contraseña en variable de entorno) es suficiente para el lanzamiento, o ya se necesitan varias personas con acceso desde el día uno? Cambia si se modela `AdminUser` en Prisma o basta con una env var.

Sin estas dos respuestas puedo avanzar igual con una decisión por defecto (sin email en fase 1, admin único en fase 3) — lo aclaro para no construir de más ni de menos.
