# DecorGrass — Plan de implementación (backend real)

> Estado: **FASE 4 completada** (calidad y producción). Las 4 fases del plan original están cerradas. Se agregaron 3 fases fuera del encargo original, pedidas explícitamente por el usuario: **FASE 5** (CRUD de Proyectos), **FASE 6** (notificaciones de leads + guía de lanzamiento), **FASE 7** (carrito/checkout con pago Wompi + rate limiting de login).

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

---

## FASE 1 COMPLETADA — Leads a PostgreSQL

### 1. Qué se hizo

- El cotizador (`QuoteWizard.tsx`) y el formulario de contacto (`contacto/page.tsx`) ahora persisten un `Lead` real en Postgres antes de abrir WhatsApp (WhatsApp se mantiene como canal, no se reemplaza).
- El precio de la cotización se recalcula **en el servidor** (`calculateQuote` sobre el catálogo del servidor), nunca se confía en el total que pudo enviar el cliente.
- Ambos formularios llevan un campo honeypot invisible (anti-spam básico) y deshabilitan el botón mientras la acción está en curso (evita doble envío por doble clic).
- Se eliminó `app/hooks/useQuote.ts` (store de Zustand sin ningún consumidor — confirmado con grep antes de borrar).

### 2. Archivos creados

- `app/lib/db.ts` — cliente Prisma singleton
- `app/lib/validations/lead.ts` — schemas Zod para cotización y contacto
- `app/lib/actions/leads.ts` — Server Actions `createQuoteLead` / `createContactLead`

### 3. Archivos modificados

- `app/components/quote/QuoteWizard.tsx` — llama a `createQuoteLead` antes de abrir WhatsApp; agrega honeypot y estado de envío/error
- `app/(store)/contacto/page.tsx` — llama a `createContactLead`; agrega honeypot, estado de éxito/error y reset del formulario
- `package.json` / `package-lock.json` — nuevas dependencias

### 4. Archivos eliminados

- `app/hooks/useQuote.ts`

### 5. Base de datos

- **Sin migraciones nuevas** — se usó el modelo `Lead` ya existente en `schema.prisma`, sin cambiarlo.
- **Hallazgo no previsto en el plan original:** Prisma 7 no acepta más `new PrismaClient()` sin argumentos cuando el `datasource` del schema no trae `url` embebido — exige un **driver adapter** explícito. Se agregaron `@prisma/adapter-pg` y `pg` (dependencias nuevas, no contempladas en la sección 5 original del plan) y `app/lib/db.ts` construye el cliente con `new PrismaPg({ connectionString: process.env.DATABASE_URL })`. Esto no cambia de ORM ni de proveedor de base de datos — es el mecanismo de conexión que Prisma 7 exige para Postgres.
- **Como el catálogo sigue sin migrar (fase 2 pendiente),** los productos de `data.ts` no tienen fila correspondiente en `GrassProduct` con el mismo slug que usa el frontend. Por eso `Lead.productId` queda `null` por ahora; el producto cotizado se registra en texto dentro de `notes` (nombre, slug, precio/m² y total). Se conecta el FK real en la fase 2, cuando el catálogo del frontend y el de la base sean el mismo.
- **Riesgos:** ninguno para datos existentes — no se tocó el schema, no se corrieron migraciones, no se borraron filas salvo los 2 leads de prueba creados y borrados durante la verificación de esta fase.

### 6. Validaciones ejecutadas

- `npx tsc --noEmit` → **sin errores**
- `npm run build` → **compila y genera las 59 páginas sin errores** (el build no cambió de rutas estáticas/dinámicas respecto al build previo a esta fase)
- Prueba manual end-to-end en `npm run dev` vía navegador:
  - Cotizador: wizard completo (Jardín/Terraza → 5m×8m → Tapicésped → datos de contacto) → verificado con una consulta directa a Postgres que el `Lead` quedó creado con el precio calculado en servidor (`$2.280.000` para 40 m² a $42.000/m² + instalación)
  - Contacto: formulario completo → verificado el `Lead` creado con `notes` = mensaje del formulario, y el mensaje de éxito "Mensaje registrado. Te contactaremos pronto." se mostró en pantalla
  - Ambos registros de prueba se eliminaron después de verificar (no quedan datos ficticios en la base)
- No hay `npm run lint` ni tests todavía — llegan en fase 4, según lo planeado.

### 7. Problemas encontrados

- El único imprevisto fue el requisito del driver adapter de Prisma 7 (documentado en §5). No bloqueó la fase, se resolvió agregando `@prisma/adapter-pg`.
- Advertencia (no error) de `pg` sobre el modo SSL `require` de la cadena de conexión de Neon — es solo un aviso de que en una futura versión mayor de `pg` cambiará la semántica; no requiere acción para el MVP, se revisita si se actualiza `pg` a v9 en el futuro.

### 8. Próximo paso

Fase 2 — migrar el catálogo (`app/lib/data.ts`) a `GrassProduct` en Postgres, y ahí sí conectar `Lead.productId` a una fila real en vez de solo texto en `notes`.

---

## FASE 2 COMPLETADA — Catálogo a PostgreSQL

### 1. Qué se hizo

- Los 38 productos y 7 proyectos de `app/lib/data.ts` quedaron migrados a `GrassProduct` y `Project` en Postgres (la base estaba vacía — el seed anterior de `seed.ts` nunca llegó a correr contra esta instancia de Neon, así que no hubo conflictos de slugs que resolver).
- `app/lib/queries/products.ts` y `app/lib/queries/projects.ts` ahora consultan Prisma en vez de envolver el array estático — mismo contrato de funciones (`getAllProducts`, `getProductBySlug`, `getFeaturedProducts`, etc.), así que ningún componente que ya las llamaba (`/catalogo`, `/producto/[slug]`, `/proyectos/[slug]`) tuvo que cambiar su lógica.
- Se detectaron y conectaron 3 puntos que bypaseaban las queries e importaban `data.ts` directamente, rompiendo la promesa de "todo lee de Postgres": `/proyectos` (listado), `sitemap.ts`, y el cotizador (`QuoteWizard.tsx` recibía `products` importado, no por prop). Los tres quedaron conectados a la base.
- `app/lib/actions/leads.ts` ahora busca el producto con `getProductBySlug` (Postgres) en vez del array estático, y **`Lead.productId` ya se guarda como FK real** a `GrassProduct` — cerrando el pendiente que quedó abierto en la fase 1.
- **Cambio de schema necesario:** el modelo `Project` no tenía `grassColor`, `installationTime`, `warranty` ni `benefits`, pero los componentes `ProjectDetails.tsx` y `ProjectSpecsTable.tsx` sí los usan (confirmado con grep antes de tocar el schema). Se agregaron esos 4 campos y se corrió una migración — tabla `Project` estaba vacía, migración sin riesgo de datos.
- SEO/SSG verificado sin romperse: `generateStaticParams` de `/producto/[slug]` y `/proyectos/[slug]` siguen generando las 38 y 7 páginas respectivamente (ahora leyendo la lista desde Postgres en build time), slugs y JSON-LD intactos.
- **Fuera de alcance deliberado:** `app/components/home/BeforeAfter.tsx` (carrusel de 3 proyectos en el home) sigue leyendo `data.ts` directo — es un componente cliente decorativo, no la fuente de verdad del catálogo/portafolio, y conectarlo requeriría pasar props desde la home. No bloquea ningún criterio de aceptación de esta fase; queda anotado para cuando exista un motivo real de negocio (p. ej. que se note desincronizado tras editar desde el admin en fase 3).

### 2. Archivos creados

- `prisma/migrate-catalog.ts` — script one-off de migración de `data.ts` → Postgres (upsert por slug, se conserva para volver a correrlo si `data.ts` cambia antes de que exista el admin)

### 3. Archivos modificados

- `prisma/schema.prisma` — 4 campos nuevos en `Project`
- `app/lib/queries/products.ts`, `app/lib/queries/projects.ts` — reescritos sobre Prisma
- `app/lib/actions/leads.ts` — usa `getProductBySlug` y setea `productId`
- `app/(store)/proyectos/page.tsx` — server component async con `getAllProjects()`
- `app/(store)/cotizador/page.tsx` — server component async, pasa `products` a `QuoteWizard`
- `app/components/quote/QuoteWizard.tsx` — recibe `products` por prop en vez de importarlo
- `app/sitemap.ts` — async, lee productos/proyectos de Postgres

### 4. Archivos eliminados

Ninguno — `app/lib/data.ts` se conserva intacto (fuente del script de migración y de los tipos `GrassProduct`/`Project`/`GrassCategory`/`GrassUse` que sigue usando toda la UI).

### 5. Base de datos

- **Migración nueva:** `20260913001627_add_project_details` — agrega `grassColor`, `installationTime`, `warranty`, `benefits` a `Project`. Tabla estaba vacía, sin riesgo.
- **Migración de datos:** `npx tsx prisma/migrate-catalog.ts` → 38 productos y 7 proyectos insertados (upsert por slug, así que es seguro volver a correrlo).
- **Riesgos:** ninguno para datos preexistentes — no había filas en `GrassProduct` ni `Project` antes de esta fase. Los únicos deletes fueron los leads de prueba creados y borrados durante la verificación.

### 6. Validaciones ejecutadas

- `npx tsc --noEmit` → sin errores
- `npm run build` → compila y genera las 38 páginas de producto + 7 de proyecto vía SSG leyendo Postgres en build time
- Prueba manual end-to-end en navegador:
  - `/catalogo` muestra los productos desde la base (verificado "Tapicésped" presente)
  - `/producto/tapicesped` muestra precio, altura, beneficios y relacionados correctos
  - `/proyectos` lista los 7 proyectos desde la base
  - `/proyectos/putting-green-terraza-residencial` muestra correctamente los 4 campos nuevos del schema (color, tiempo de instalación, garantía, logros)
  - `/cotizador` carga los productos por prop (ya no por import estático) y, al completar el wizard, el `Lead` creado tiene `productId` apuntando a una fila real de `GrassProduct` (verificado con `include: { product: true }`)
  - El lead de prueba se eliminó después de verificar

### 7. Problemas encontrados

- El único imprevisto fue descubrir en el camino que 3 lugares (`/proyectos`, `sitemap.ts`, `QuoteWizard`) leían `data.ts` directo sin pasar por las queries — no estaba explícito en el plan original, se detectó con grep antes de dar la fase por cerrada y se corrigió como parte del mismo alcance (son la misma migración, dejarlos sueltos habría sido una migración a medias).
- Nada bloqueante.

### 8. Próximo paso

Fase 3 — panel admin real: autenticación (`proxy.ts`, no `middleware.ts` — Next 16) y CRUD de productos/leads sobre las tablas que ya están pobladas y conectadas.

---

## FASE 3 COMPLETADA — Admin real con autenticación

### 1. Qué se hizo

- **Autenticación de admin único:** sesión JWT firmada (`jose`) en cookie `httpOnly`, mismo patrón que ya usa `sepseven/app/lib/auth.ts` (reutilizado, no reinventado). Sin tabla `User` — un solo admin validado contra `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` (variables de entorno), con una credencial de desarrollo de respaldo si esas variables no están configuradas.
- **`proxy.ts`** (raíz del proyecto — **no** `middleware.ts`, por el rename de Next 16 documentado en la fase 0) protege todo `/dashboard/*`: sin sesión válida, redirige a `/login`; con sesión, `/login` redirige a `/dashboard`.
- **`/login`** — formulario simple con `useActionState` + Server Action, sin librería de formularios nueva.
- **Dashboard con datos reales**: los 4 stat cards y "últimas cotizaciones" ahora leen `prisma.grassProduct.count()`, `prisma.project.count()`, `prisma.lead.count()` — cero números inventados; si no hay leads, dice explícitamente "Todavía no hay cotizaciones."
- **`/dashboard/leads`**: listado completo, cambio de estado inline (`NEW/CONTACTED/QUOTED/CLOSED/LOST`, mismo enum del schema) sin recargar la página. **`/dashboard/leads/[id]`**: detalle con datos de contacto, producto cotizado (si aplica), botón de WhatsApp directo, `mailto:` si hay email, y notas internas editables.
- **`/dashboard/productos`**: listado con precio, categoría, destacado y disponibilidad (toggle inline). **`/dashboard/productos/nuevo`** y **`/dashboard/productos/[id]`**: mismo formulario compartido (`ProductForm.tsx`) para crear y editar — todos los campos del modelo `GrassProduct`, con validación Zod server-side (slug único, precio positivo, etc.). "Eliminar" no existe: se marca `available: false` (agotado) en vez de borrar, tal como pedía el encargo.
- **`/dashboard/proyectos`**: listado de solo lectura (ver §7 — CRUD completo de proyectos quedó fuera de alcance, documentado, no implementado a medias).
- **Sidebar arreglado**: se eliminaron los enlaces a `/dashboard/clientes` y `/dashboard/ajustes` — no hay modelo `Customer` ni de configuración detrás, y crear páginas vacías solo para que el enlace no diera 404 habría sido una funcionalidad falsa (explícitamente prohibido en el encargo). Los 4 enlaces que quedan (Resumen, Cotizaciones, Productos, Proyectos) van todos a páginas reales.
- **Logout real** vía Server Action, botón en el sidebar.

### 2. Archivos creados

- `app/lib/auth.ts`, `app/lib/actions/auth.ts`
- `proxy.ts`
- `app/(auth)/login/page.tsx`, `app/(auth)/login/LoginForm.tsx`
- `app/lib/validations/product.ts`, `app/lib/actions/products.ts`
- `app/dashboard/leads/page.tsx`, `app/dashboard/leads/LeadStatusSelect.tsx`, `app/dashboard/leads/[id]/page.tsx`, `app/dashboard/leads/[id]/NotesForm.tsx`
- `app/dashboard/productos/page.tsx`, `app/dashboard/productos/ProductForm.tsx`, `app/dashboard/productos/ToggleAvailabilityButton.tsx`, `app/dashboard/productos/nuevo/page.tsx`, `app/dashboard/productos/[id]/page.tsx`
- `app/dashboard/proyectos/page.tsx`

### 3. Archivos modificados

- `app/dashboard/layout.tsx` — sidebar con enlaces reales + logout
- `app/dashboard/page.tsx` — stats y leads recientes desde Postgres
- `app/lib/actions/leads.ts` — `updateLeadStatus`, `updateLeadNotes`, `updateLeadNotesAction` (todas protegidas con `requireAdmin()`)
- `.env.example` — documenta `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
- `package.json`/`package-lock.json` — `jose`, `bcryptjs`, `@types/bcryptjs`

### 4. Archivos eliminados

Ninguno.

### 5. Base de datos

Sin migraciones nuevas — toda la fase corre sobre las tablas `GrassProduct` y `Lead` que ya existían desde la fase 2. Sin riesgos: los únicos registros creados/borrados fueron datos de prueba durante la verificación (un producto y un lead, ambos eliminados al final).

### 6. Validaciones ejecutadas

- `npx tsc --noEmit` → sin errores
- `npm run build` → compila; el log confirma `ƒ Proxy (Middleware)`, es decir que Next 16 reconoció `proxy.ts` correctamente
- Prueba manual end-to-end en navegador:
  - `/dashboard` sin sesión → redirige a `/login` (verificado dos veces, antes y después de la fase)
  - Login con contraseña incorrecta → muestra "Credenciales inválidas"; con la correcta → entra y ve datos reales (38 productos, 7 proyectos, 0 cotizaciones antes de las pruebas)
  - Crear producto desde `/dashboard/productos/nuevo` → aparece en la lista del admin y en `/producto/<slug>` público sin rebuild (`revalidatePath` funcionando)
  - Marcar producto como agotado (toggle) → confirmado `available: false` en la base
  - Cambiar estado de un lead desde la lista → confirmado en la base (`CONTACTED`)
  - Editar y guardar notas desde el detalle de un lead → confirmado en la base
  - Logout → vuelve a `/login`; navegar a `/dashboard` después → vuelve a redirigir (protección real, no solo visual)
  - Todos los datos de prueba (1 producto, 1 lead) se eliminaron después de verificar

### 7. Problemas encontrados

- Ninguno bloqueante. Decisión de alcance documentada: CRUD completo de `/dashboard/proyectos` (crear/editar/archivar) no se implementó — el encargo permitía dejarlo fuera si excedía el alcance del MVP, y el catálogo de productos es lo que el negocio edita con más frecuencia. La página de solo lectura ya resuelve el enlace roto del sidebar; el CRUD completo queda como trabajo futuro si el negocio empieza a subir proyectos seguido.
- Durante la verificación manual, el overlay de Next.js DevTools (visible solo en modo desarrollo) tapó momentáneamente el botón de "Cerrar sesión" en una captura — no es un defecto de la app, no aparece en producción.

### 8. Próximo paso

Fase 4 — calidad y producción: instalar ESLint (Next 16 quitó `next lint`), convertir imágenes `.HEIC`, reemplazar `<img>` por `next/image` donde falta, agregar `error.tsx`/`loading.tsx`, y un test de humo por flujo crítico (login, envío de cotización).

---

## FASE 4 COMPLETADA — Calidad y producción

### 1. Qué se hizo

- **ESLint instalado y configurado** con `eslint.config.mjs` (flat config, formato obligatorio en Next 16 — `next lint` ya no existe, el script `lint` ahora llama a `eslint .` directo, tal como documenta la fase 0). `eslint-config-next/core-web-vitals` + `/typescript`.
- **4 errores de lint reales corregidos** (no solo silenciados): `CatalogClient.tsx` creaba un componente (`FilterPanel`) dentro del render en cada renderizado — se movió a un componente de nivel superior con props explícitas (bug real de React, no cosmético: resetea su estado interno en cada render). Comillas sin escapar en `Testimonials.tsx`. 5 warnings triviales de imports/variables sin usar, corregidos.
- **Bug real encontrado por los tests, no por inspección manual:** el honeypot anti-spam (`company`) usaba `z.string().max(0)` en el schema — si un bot llenaba el campo, `safeParse` fallaba *antes* de llegar a la lógica que debía ignorarlo silenciosamente (`if (data.company) return { ok: true }`), así que el bot recibía un error explícito en vez de una falsa confirmación silenciosa, delatando el honeypot. Corregido en `app/lib/validations/lead.ts` y en el schema del cliente en `contacto/page.tsx`: el campo ahora acepta cualquier string, y la decisión de ignorar el envío queda solo en la Server Action, como se diseñó en la fase 1.
- **Imágenes:** eliminados 6 archivos `.HEIC` (formato no soportado por navegadores, sin ninguna referencia en el código — sus equivalentes `.jpeg`/`.png` sí se usan) y el Excel accidentalmente publicado en `public/productos/` (`descripcion gramas.xlsx` + su archivo de bloqueo temporal). Reemplazado `<img>` por `next/image` en los 6 componentes que aún lo usaban con contenedor de tamaño fijo (`ProductCard`, `ProjectCard`, `BeforeAfter`, `ProjectBeforeAfter`, `ProjectGallery` — miniatura e imagen principal, `QuoteWizard`). El visor de zoom de `ProjectGallery` se dejó con `<img>` deliberadamente: es un lightbox de tamaño variable según el aspecto de cada foto, donde `next/image` exige un contenedor con dimensiones fijas — forzarlo ahí habría sido peor que la alternativa nativa.
- **`error.tsx`/`loading.tsx`** agregados en `/catalogo`, `/producto/[slug]` y `/dashboard` (skeletons simples + botón de reintentar).
- **4 tests de humo** sobre los flujos que de romperse tienen más costo: cálculo de cotización (dinero mal calculado = cotizaciones incorrectas), validación de leads (incluyendo el honeypot — el mismo test que encontró el bug real de arriba), validación de producto del admin (slug inválido rompería la URL pública), y rechazo de credenciales de login (la única puerta de `/dashboard`). No se probó la ruta de éxito de `login()` porque llama a `cookies()` de `next/headers`, que exige un contexto de request real — mockear ese runtime completo habría sido más código que la lógica que protege.

### 2. Archivos creados

- `eslint.config.mjs`
- `app/(store)/catalogo/loading.tsx`, `app/(store)/catalogo/error.tsx`
- `app/(store)/producto/[slug]/loading.tsx`, `app/(store)/producto/[slug]/error.tsx`
- `app/dashboard/loading.tsx`, `app/dashboard/error.tsx`
- `tests/quote-calculation.test.ts`, `tests/lead-validation.test.ts`, `tests/auth.test.ts`, `tests/product-validation.test.ts`

### 3. Archivos modificados

- `package.json` — scripts `lint`, `typecheck`, `test`; nuevas devDependencies (`eslint`, `eslint-config-next`, `typescript-eslint`)
- `tsconfig.json` — `allowImportingTsExtensions: true` (los tests importan con extensión `.ts`, requerido para que `tsx`/Node ESM los resuelva)
- `app/components/catalog/CatalogClient.tsx` — `FilterPanel` extraído fuera del render
- `app/components/home/Testimonials.tsx` — comillas escapadas
- `app/(store)/instalacion/page.tsx`, `app/components/layout/Navbar.tsx`, `app/components/product/ProductDetails.tsx`, `app/hooks/useWishlist.ts` — limpieza de warnings
- `app/lib/validations/lead.ts`, `app/(store)/contacto/page.tsx` — fix del honeypot
- `app/components/ui/ProductCard.tsx`, `app/components/project/ProjectCard.tsx`, `app/components/home/BeforeAfter.tsx`, `app/components/project/ProjectBeforeAfter.tsx`, `app/components/project/ProjectGallery.tsx`, `app/components/quote/QuoteWizard.tsx` — `<img>` → `next/image`

### 4. Archivos eliminados

- 6 archivos `.HEIC` en `public/productos/` y `public/soluciones/`
- `public/productos/descripcion gramas.xlsx` y `public/productos/~$descripcion gramas.xlsx`

### 5. Base de datos

Sin cambios.

### 6. Validaciones ejecutadas

- `npm run lint` → **0 errores**, 2 warnings informativos que se dejan deliberadamente (uno de React Compiler sobre `watch()` de react-hook-form — no accionable sin reescribir ese formulario; otro de estilo sobre `postcss.config.mjs`, boilerplate de configuración)
- `npx tsc --noEmit` → sin errores
- `npm run build` → compila y genera las 64 rutas sin errores
- `npm run test` → **14/14 tests pasan** (vía `tsx --test`, no `node --test` puro — Node por sí solo no resuelve `next/headers` ni los imports sin extensión que usa el resto del código; `tsx` sí, porque aplica la misma resolución que el bundler real, y ya era una dependencia del proyecto, no una nueva)
- Verificación visual en navegador: catálogo y ficha de producto cargan con imágenes servidas vía `/_next/image` (200 OK), sin regresiones

### 7. Problemas encontrados

- El hallazgo real de la fase fue el bug del honeypot (ver §1) — confirma el valor de escribir los tests en vez de solo instalarlos como checkbox.
- 2 warnings de lint se dejan sin resolver (ver §6) — no son errores, arreglarlos no aporta valor proporcional al esfuerzo en esta etapa.

### 8. Próximo paso

Ninguno pendiente del plan original. El MVP cumple los 16 puntos del objetivo principal (sección 4 del encargo). Como trabajo futuro, no bloqueante: CRUD completo de `/dashboard/proyectos` (hoy es de solo lectura, decisión documentada en fase 3) y evaluar Cloudinary si el volumen de imágenes crece lo suficiente para justificarlo.

---

## FASE 5 (fuera del encargo original) — CRUD completo de Proyectos

### 1. Qué se hizo

`/dashboard/proyectos` dejó de ser de solo lectura. Mismo patrón que el CRUD de productos (fase 3): formulario compartido para crear/editar, validación Zod server-side (slug único con el mismo regex que productos), y "despublicar" (`published: false`) en vez de borrar — coherente con el criterio de `toggleProductAvailability` de no eliminar filas del catálogo/portafolio, solo ocultarlas. El listado del admin ahora muestra **todos** los proyectos (publicados y ocultos), a diferencia de `getAllProjects()` (que sigue filtrando `published: true` para el sitio público) — por eso el admin consulta `prisma.project.findMany()` directo en vez de reusar esa query.

### 2. Archivos creados

- `app/lib/validations/project.ts`
- `app/lib/actions/projects.ts` (`createProject`, `updateProject`, `toggleProjectPublished`, todas protegidas con `requireAdmin()`)
- `app/dashboard/proyectos/ProjectForm.tsx`, `app/dashboard/proyectos/TogglePublishedButton.tsx`
- `app/dashboard/proyectos/nuevo/page.tsx`, `app/dashboard/proyectos/[id]/page.tsx`

### 3. Archivos modificados

- `app/dashboard/proyectos/page.tsx` — de listado de solo lectura a listado administrable completo

### 4. Archivos eliminados

Ninguno.

### 5. Base de datos

Sin cambios de schema — el modelo `Project` ya tenía todos los campos necesarios desde la fase 2.

### 6. Validaciones ejecutadas

- `npm run lint` → 0 errores (se encontraron y corrigieron 4 comillas sin escapar nuevas en `ProjectForm.tsx` antes de dar la fase por cerrada)
- `npx tsc --noEmit` → sin errores
- `npm run build` → compila y genera las rutas nuevas (`/dashboard/proyectos/[id]`, `/dashboard/proyectos/nuevo`)
- `npm run test` → 14/14 (sin regresiones)
- Prueba manual end-to-end en navegador: crear un proyecto → aparece en `/dashboard/proyectos` y en `/proyectos/<slug>` público sin rebuild; despublicarlo → desaparece del listado admin visualmente (badge "Oculto") y el público da 404 (confirmado que `getProjectBySlug` respeta `published`); editar el título → confirmado en la base; proyecto de prueba eliminado al final

### 7. Problemas encontrados

Ninguno bloqueante.

### 8. Próximo paso

Ninguno pendiente. Con esta fase, el admin tiene CRUD real sobre las dos entidades de catálogo (productos y proyectos) — la única asimetría documentada que queda es que "eliminar" en ambos casos es en realidad "ocultar", una decisión deliberada, no un pendiente.

---

## FASE 6 (fuera del encargo original) — Notificaciones de leads y checklist de lanzamiento

### 1. Qué se hizo

- **Notificaciones por email**: `app/lib/email.ts` envía un aviso de texto plano vía Resend cuando entra una cotización o un contacto nuevo. Es *best-effort* deliberado: si `RESEND_API_KEY`/`NOTIFICATION_EMAIL` no están configuradas, o si Resend falla, el lead igual queda guardado en Postgres — el email nunca puede tumbar la persistencia, que es lo que de verdad no puede perderse.
- **Dominio centralizado**: `metadataBase`, `robots.ts` y `sitemap.ts` tenían `https://decorgrass.com` hardcodeado en 3 lugares distintos. Se creó `app/lib/site.ts` (`SITE_URL`, con fallback al mismo valor) para que cambiar el dominio real sea una sola variable de entorno, no una búsqueda y reemplazo en el repo.
- **`docs/LAUNCH_CHECKLIST.md`**: guía paso a paso para el deploy en Vercel — variables de entorno (con cómo generar cada una), verificación de build, configuración de dominio, configuración de Resend, y una checklist de verificación post-deploy. No pude ejecutar ningún paso de esta guía yo mismo (no tengo acceso a Vercel, al dominio ni a la cuenta de Resend del negocio) — es para que la seguas vos.
- **Aprovechado el cambio para agregar `/login` a `robots.ts`** (antes solo `/dashboard/` estaba en disallow) — consistente con que ya tenía `robots: {index:false}` a nivel de página, pero faltaba en el archivo robots.txt real.

### 2. Archivos creados

- `app/lib/email.ts`
- `app/lib/site.ts`
- `docs/LAUNCH_CHECKLIST.md`

### 3. Archivos modificados

- `app/lib/actions/leads.ts` — llama a `notifyNewLead` tras persistir cada lead
- `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` — usan `SITE_URL` en vez del literal hardcodeado
- `.env.example` — documenta `SITE_URL`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`
- `package.json`/`package-lock.json` — nueva dependencia `resend`

### 4. Archivos eliminados

Ninguno.

### 5. Base de datos

Sin cambios.

### 6. Validaciones ejecutadas

- `npm run lint` → 0 errores
- `npx tsc --noEmit` → sin errores
- `npm run build` → compila, 65 rutas
- `npm run test` → 14/14 sin regresiones
- Prueba manual en navegador: envío de contacto con `RESEND_API_KEY` **sin configurar** (estado actual real del `.env`) → el lead se guardó igual en Postgres, sin ningún error en los logs del servidor, confirmando que la ausencia de configuración de email no rompe el flujo principal. No se pudo probar el envío real de un email porque eso requiere una cuenta de Resend del negocio, que no existe todavía — queda como parte de la verificación post-deploy en `LAUNCH_CHECKLIST.md`.

### 7. Problemas encontrados

Ninguno bloqueante. Limitación reconocida: no pude verificar el envío real de emails (sin cuenta de Resend), ni ejecutar ningún paso del checklist de lanzamiento (sin acceso a Vercel/dominio) — ambos quedan documentados para que el usuario los ejecute.

### 8. Próximo paso

Ninguno de mi lado. Le corresponde al usuario: crear la cuenta de Resend, configurar las variables de entorno en Vercel, y recorrer `docs/LAUNCH_CHECKLIST.md`.

---

## FASE 7 (fuera del encargo original) — Carrito, checkout con Wompi y rate limiting

### 1. Qué se hizo

**Carrito multi-producto real**, agregado *junto* al flujo de cotización existente (no lo reemplaza — el negocio sigue pudiendo cerrar por WhatsApp):

- `app/hooks/useCart.ts`: store Zustand persistido en localStorage (mismo patrón que `useWishlist.ts`), items por producto con m² e instalación, precio recalculado con `calculateQuote` (reuso directo de la lógica que ya usa el cotizador).
- Botón "Agregar al carrito" en `M2Calculator.tsx` (la ficha de producto), junto al de WhatsApp existente — no se tocó el flujo de cotización.
- Ícono de carrito con contador en `Navbar.tsx`.
- `/carrito`: ver, editar m²/instalación, quitar items.
- `/checkout`: datos del cliente → crea el pedido → botón de pago Wompi.
- `/pedido/[reference]`: estado del pedido (lee de Postgres, actualizado solo por el webhook — nunca por el frontend).

**Pago con Wompi**, verificado contra la documentación oficial en vivo (no de memoria, dado que es dinero real):

- `app/lib/wompi.ts`: firma de integridad del widget (`SHA256(reference + amount_in_cents + currency + integrity_secret)`) y verificación del checksum de webhooks (`SHA256(propiedades concatenadas + timestamp + events_secret)`) — ambos algoritmos confirmados vía fetch a `docs.wompi.co` el mismo día de la implementación.
- `app/lib/actions/orders.ts` (`createOrder`): igual que `createQuoteLead`, el precio de cada línea se recalcula en el servidor contra el catálogo real — nunca se confía en lo que mande el carrito del cliente.
- `app/api/webhooks/wompi/route.ts`: única ruta de API real del proyecto — se justifica porque un webhook necesita un endpoint HTTP, no puede ser una Server Action. Verifica el checksum antes de tocar la base; sin eso, cualquiera podría hacer un POST falso marcando un pedido como pagado.
- Modelos nuevos: `Order`, `OrderItem`, enum `OrderStatus`.
- Admin: `/dashboard/pedidos` (listado + detalle, solo lectura — el estado lo cambia el webhook, no el admin manualmente).

**Rate limiting del login** (lo único que el usuario pidió de seguridad):

- Modelo `LoginAttempt` + `app/lib/rate-limit.ts`: bloquea tras 5 intentos fallidos en 15 minutos, por email intentado. Respaldado en Postgres, no en memoria — en Vercel cada invocación puede ser una instancia sin estado compartido, así que un contador en memoria no protegería nada en producción.
- Falla abierto ante errores de infraestructura: si Postgres no responde al chequear el límite, no bloquea el login — un problema de base de datos no debe dejar al único admin sin acceso.

**Dos bugs reales encontrados y corregidos durante la verificación manual** (no en el primer intento):

1. `CheckoutForm.tsx` redirigía a `/carrito` en *cada* carga de `/checkout`, incluso con el carrito lleno — porque el carrito persiste en localStorage y solo se conoce después de hidratar en el cliente; en el primer render `items` siempre es `[]`. Se corrigió con un flag de hidratación antes de evaluar el guard de redirección.
2. `createOrder` creaba el pedido en la base y *después* intentaba generar la firma de Wompi — si `WOMPI_INTEGRITY_SECRET` no estaba configurada (como en este entorno de desarrollo), la función fallaba y el usuario veía un error genérico, sin saber que su pedido en realidad sí se había guardado (huérfano, sin ninguna forma de que el negocio lo relacionara con el error mostrado). Se corrigió para que la firma sea opcional en el resultado (`signature: string | null`) — el pedido se crea siempre, y el checkout cae al mensaje de "pago por WhatsApp" cuando no hay firma, en vez de fallar.

### 2. Archivos creados

- Schema: modelos `Order`, `OrderItem`, `LoginAttempt`, enum `OrderStatus`, migración `20260916030452_add_orders_and_login_attempts`
- `app/lib/wompi.ts`, `app/lib/rate-limit.ts`, `app/hooks/useCart.ts`
- `app/lib/validations/order.ts`, `app/lib/actions/orders.ts`
- `app/api/webhooks/wompi/route.ts`
- `app/(store)/carrito/page.tsx`, `app/(store)/checkout/page.tsx`, `app/(store)/checkout/CheckoutForm.tsx`, `app/(store)/pedido/[reference]/page.tsx`
- `app/dashboard/pedidos/page.tsx`, `app/dashboard/pedidos/[id]/page.tsx`

### 3. Archivos modificados

- `app/lib/auth.ts` — usa `rate-limit.ts` en `login()`
- `app/lib/db.ts` — agrega `import "dotenv/config"` (sin esto, cualquier script o test fuera del runtime de Next corre con `DATABASE_URL` undefined)
- `app/components/product/M2Calculator.tsx`, `app/components/layout/Navbar.tsx` — botón de carrito y contador
- `app/dashboard/layout.tsx` — enlace a Pedidos en el sidebar
- `tests/auth.test.ts` — limpieza de `LoginAttempt` antes/después, test nuevo del rate limit
- `.env.example` — variables de Wompi documentadas

### 4. Archivos eliminados

Ninguno.

### 5. Base de datos

Migración `20260916030452_add_orders_and_login_attempts` — aditiva, tablas nuevas, sin riesgo para datos existentes.

### 6. Validaciones ejecutadas

- `npm run lint` → 0 errores
- `npx tsc --noEmit` → sin errores
- `npm run build` → compila, 69 rutas (incluye `/api/webhooks/wompi` como única ruta dinámica de API)
- `npm run test` → 15/15 (14 previos + 1 nuevo test de rate limit, que ejercita el bloqueo real contra Postgres)
- **Prueba manual end-to-end completa**, incluyendo el webhook con firma real calculada (con credenciales Wompi de prueba temporales en `.env`, retiradas al terminar):
  1. Agregar producto al carrito desde la ficha → verificado en `/carrito`
  2. Checkout → pedido creado en Postgres con precio recalculado en servidor (confirmado: mismo total que mostraba el carrito)
  3. Webhook con checksum **válido** (`transaction.updated`, status `APPROVED`) → `200 OK`, pedido pasa a `APPROVED` con `wompiTransactionId` guardado
  4. Webhook con checksum **inválido** → `401`, pedido sin modificar (probado explícitamente para confirmar que no cualquiera puede marcar un pedido como pagado)
  5. `/pedido/[reference]` muestra "Pago aprobado" reflejando el estado real de la base
  6. `/dashboard/pedidos` muestra el pedido con su estado correcto
  7. Datos de prueba eliminados de la base al terminar

### 7. Problemas encontrados

Los dos bugs de hidratación/orden-huérfana descritos en §1 — ambos se encontraron durante la verificación manual (no durante el desarrollo inicial) y se corrigieron antes de dar la fase por cerrada. Ningún problema sin resolver.

### 8. Próximo paso

Ninguno de mi lado. Antes de aceptar pagos reales, el usuario necesita: crear cuenta en Wompi, configurar `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`/`WOMPI_INTEGRITY_SECRET`/`WOMPI_EVENTS_SECRET` en producción, y registrar la URL del webhook (`https://<dominio>/api/webhooks/wompi`) en el dashboard de Wompi — ninguno de estos tres pasos se puede hacer sin la cuenta real del negocio.
