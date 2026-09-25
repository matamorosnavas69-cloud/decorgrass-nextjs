# DecorGrass — Checklist de lanzamiento a producción

> Esta guía es para que la ejecutes vos en Vercel/Neon/Resend — no tengo acceso a esas cuentas. Cada paso dice exactamente qué hacer y cómo verificar que funcionó.

## 1. Variables de entorno en Vercel

En **Project Settings → Environment Variables**, agregá estas para el entorno **Production** (y **Preview** si querés probar antes de mergear a main):

| Variable | Valor | Cómo obtenerlo |
|---|---|---|
| `DATABASE_URL` | La cadena de conexión de Neon | Ya la tenés en tu `.env` local — copiala tal cual (incluye `?sslmode=require`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Llave pública de Clerk (`pk_live_...`) | Dashboard de Clerk → instancia de **producción** → API Keys (o `clerk env pull --instance prod`) |
| `CLERK_SECRET_KEY` | Llave secreta de Clerk (`sk_live_...`) | Mismo lugar — nunca exponerla al cliente |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Fija |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Fija |
| `SITE_URL` | `https://tu-dominio-real.com` | El dominio final una vez configurado (paso 3) |
| `RESEND_API_KEY` | Tu API key de Resend | [resend.com](https://resend.com) → API Keys → Create |
| `NOTIFICATION_EMAIL` | El email donde el equipo comercial quiere recibir avisos de leads nuevos | — |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Llave pública de Wompi | Dashboard de Wompi → Configuración → Secretos para integración técnica (usar `pub_test_...` para probar, `pub_prod_...` en real) |
| `WOMPI_INTEGRITY_SECRET` | Secreto de integridad | Mismo lugar que la anterior — nunca exponerlo al cliente |
| `WOMPI_EVENTS_SECRET` | Secreto de eventos/webhooks | Mismo lugar — es el que verifica que un webhook realmente vino de Wompi |

**Importante:** el login y los roles del panel dependen de Clerk. Antes de lanzar hay que (1) crear la instancia de **producción** de Clerk con `clerk deploy` (exige un dominio propio, no funciona sobre `vercel.app`), (2) activar en ella el claim de sesión `{"metadata": "{{user.public_metadata}}"}` y el registro solo por invitación, y (3) crear el primer administrador asignándole `{"role": "admin"}` en su *Public metadata*. Sin rol nadie entra al panel (deny-by-default).

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

## 5. Wompi — activar pagos reales

1. Creá la cuenta en [wompi.co](https://wompi.co) y completá la verificación del negocio (Wompi pide esto antes de dar llaves de producción — puede tardar unos días, arrancá esto temprano).
2. Configurá las 3 variables de Wompi de la tabla del paso 1 (`pub_test_...` para probar primero, `pub_prod_...` cuando esté verificado).
3. **Registrá el webhook**: Dashboard de Wompi → Configuración → Webhooks → agregá `https://tu-dominio-real.com/api/webhooks/wompi`. Sin este paso, los pagos se procesan pero el pedido en `/dashboard/pedidos` nunca pasa de "Pendiente" — el webhook es la única forma en que el sitio se entera de que un pago se aprobó.
4. Hacé una compra de prueba completa con una [tarjeta de prueba de Wompi](https://docs.wompi.co/docs/colombia/tarjetas-de-prueba/) en modo `pub_test_`:
   - [ ] El checkout muestra el botón de pago de Wompi (no el mensaje de "pago no disponible")
   - [ ] Después de pagar, `/pedido/<referencia>` muestra "Pago aprobado" en menos de un minuto
   - [ ] El pedido aparece en `/dashboard/pedidos` con el mismo estado
5. Recién después de una prueba exitosa en `pub_test_`, cambiá las 3 variables a las llaves `pub_prod_`/producción.

## 6. Verificación post-deploy (en el dominio real, no en localhost)

Marcá cada uno manualmente después del primer deploy:

- [ ] `/` carga y se ve bien
- [ ] `/catalogo` muestra productos reales (no vacío)
- [ ] `/producto/<cualquier-slug>` abre una ficha con precio e imágenes
- [ ] `/cotizador` completa el wizard de 4 pasos y muestra confirmación
- [ ] `/contacto` envía y muestra "Mensaje registrado"
- [ ] `/dashboard` **sin sesión** redirige a `/sign-in` (probalo en una ventana de incógnito)
- [ ] Login del primer administrador funciona y entra a `/dashboard`
- [ ] Una cuenta **sin rol** que intenta entrar termina en `/acceso-denegado`
- [ ] La cotización y el contacto de los dos pasos anteriores aparecen en `/dashboard/leads`
- [ ] Si configuraste Resend: llegó un email a `NOTIFICATION_EMAIL` por cada uno
- [ ] Crear un producto de prueba desde `/dashboard/productos/nuevo` → aparece en `/catalogo` sin redeploy → **borralo o marcalo agotado** después de probar
- [ ] `/sitemap.xml` y `/robots.txt` muestran el dominio real, no `decorgrass.com` (a menos que ese sea tu dominio real)
- [ ] Compartir un link de un producto en WhatsApp/redes muestra la imagen de vista previa (Open Graph) correcta
- [ ] Agregar un producto al carrito, completar checkout, y verificar que el pedido aparece en `/dashboard/pedidos`
- [ ] Un POST al webhook con checksum inválido responde `401` (protección contra pagos falsos — no debería hacer falta probarlo en producción, pero si tenés dudas, es la misma prueba que se corrió en desarrollo)

## 7. Después de lanzar

- Borrá cualquier lead, producto o pedido de prueba que hayas creado durante la verificación.
- Guardá `CLERK_SECRET_KEY` en un lugar seguro (gestor de contraseñas del equipo). Si se filtra, regenerala en el dashboard de Clerk y actualizala en Vercel.
- Contale al equipo comercial que ya pueden revisar `/dashboard/leads` (y recibirán email si configuraste Resend).
