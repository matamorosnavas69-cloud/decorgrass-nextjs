# DecorGrass — Checklist de lanzamiento a producción

> Esta guía es para que la ejecutes vos en Vercel/Neon/Resend — no tengo acceso a esas cuentas. Cada paso dice exactamente qué hacer y cómo verificar que funcionó.

## 1. Variables de entorno en Vercel

En **Project Settings → Environment Variables**, agregá estas para el entorno **Production** (y **Preview** si querés probar antes de mergear a main):

| Variable | Valor | Cómo obtenerlo |
|---|---|---|
| `DATABASE_URL` | La cadena de conexión de Neon | Ya la tenés en tu `.env` local — copiala tal cual (incluye `?sslmode=require`) |
| `AUTH_SECRET` | Un string aleatorio largo (32+ caracteres) | Generalo con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL` | El email real del administrador | El que va a usar el negocio para entrar a `/dashboard` |
| `ADMIN_PASSWORD_HASH` | El hash bcrypt de la contraseña real | Generalo con: `node -e "console.log(require('bcryptjs').hashSync('TU-PASSWORD-REAL', 10))"` — nunca subas la contraseña en texto plano, solo el hash |
| `SITE_URL` | `https://tu-dominio-real.com` | El dominio final una vez configurado (paso 3) |
| `RESEND_API_KEY` | Tu API key de Resend | [resend.com](https://resend.com) → API Keys → Create |
| `NOTIFICATION_EMAIL` | El email donde el equipo comercial quiere recibir avisos de leads nuevos | — |

**Importante:** sin `AUTH_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD_HASH` configuradas, el sitio en producción cae a la credencial de desarrollo (`admin@decorgrass.com` / `decorgrass2026`, definida en `app/lib/auth.ts`) — **cualquiera que la conozca entra al dashboard**. No lances a producción sin configurar estas tres.

## 2. Verificar el build de producción localmente

Antes de deployar, confirmá que el build pasa con las variables reales (no las de desarrollo):

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Los 4 comandos deben terminar sin errores. Si `npm run build` falla por algo relacionado a `DATABASE_URL`, revisá que la cadena de conexión tenga `?sslmode=require` (Neon la exige).

## 3. Dominio

1. En Vercel: **Project Settings → Domains** → agregá tu dominio.
2. Seguí las instrucciones de Vercel para apuntar los DNS (generalmente un registro `A` o `CNAME` en tu proveedor de dominio).
3. Una vez propagado (puede tardar hasta 24h, normalmente minutos), actualizá `SITE_URL` en las variables de entorno de Vercel con el dominio final y volvé a deployar.

## 4. Resend — dominio de envío

Por defecto, `app/lib/email.ts` envía desde `onboarding@resend.dev` (funciona sin configurar nada, pero se ve poco profesional y Resend limita el volumen). Para enviar desde `notificaciones@tu-dominio.com`:

1. En Resend: **Domains → Add Domain** → seguí las instrucciones para agregar los registros DNS (SPF/DKIM) en tu proveedor de dominio.
2. Una vez verificado, editá la constante `FROM` en `app/lib/email.ts` con tu dirección verificada.

Esto no es bloqueante para lanzar — podés lanzar con `onboarding@resend.dev` y cambiarlo después.

## 5. Verificación post-deploy (en el dominio real, no en localhost)

Marcá cada uno manualmente después del primer deploy:

- [ ] `/` carga y se ve bien
- [ ] `/catalogo` muestra productos reales (no vacío)
- [ ] `/producto/<cualquier-slug>` abre una ficha con precio e imágenes
- [ ] `/cotizador` completa el wizard de 4 pasos y muestra confirmación
- [ ] `/contacto` envía y muestra "Mensaje registrado"
- [ ] `/dashboard` **sin sesión** redirige a `/login` (probalo en una ventana de incógnito)
- [ ] Login con `ADMIN_EMAIL`/contraseña real funciona y entra a `/dashboard`
- [ ] La cotización y el contacto de los dos pasos anteriores aparecen en `/dashboard/leads`
- [ ] Si configuraste Resend: llegó un email a `NOTIFICATION_EMAIL` por cada uno
- [ ] Crear un producto de prueba desde `/dashboard/productos/nuevo` → aparece en `/catalogo` sin redeploy → **borralo o marcalo agotado** después de probar
- [ ] `/sitemap.xml` y `/robots.txt` muestran el dominio real, no `decorgrass.com` (a menos que ese sea tu dominio real)
- [ ] Compartir un link de un producto en WhatsApp/redes muestra la imagen de vista previa (Open Graph) correcta

## 6. Después de lanzar

- Borrá cualquier lead o producto de prueba que hayas creado durante la verificación.
- Guardá `ADMIN_PASSWORD_HASH` y `AUTH_SECRET` en un lugar seguro (gestor de contraseñas del equipo) — si se pierden, hay que generar unos nuevos y todas las sesiones activas de admin se invalidan.
- Contale al equipo comercial que ya pueden revisar `/dashboard/leads` (y recibirán email si configuraste Resend).
