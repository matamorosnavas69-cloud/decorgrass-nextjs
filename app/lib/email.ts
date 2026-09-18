import { Resend } from "resend";

// ponytail: sin plantillas HTML ni cola de reintentos — un email de texto
// plano, best-effort. Si falla, el lead ya quedó guardado en Postgres (eso
// es lo que no puede perderse); el email es una comodidad, no la fuente de
// verdad. Si RESEND_API_KEY no está configurada, se registra y se sigue.

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "Decorgrass <onboarding@resend.dev>"; // reemplazar por un dominio verificado en producción
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

export async function notifyNewLead(params: {
  kind: "cotización" | "contacto";
  name: string;
  phone: string;
  city?: string | null;
  spaceType?: string | null;
  squareMeters?: number | null;
  productName?: string | null;
  message?: string | null;
}): Promise<void> {
  if (!resend || !NOTIFICATION_EMAIL) return;

  const lines = [
    `Nueva ${params.kind} recibida en Decorgrass`,
    "",
    `Nombre: ${params.name}`,
    `Teléfono: ${params.phone}`,
    params.city ? `Ciudad: ${params.city}` : null,
    params.spaceType ? `Tipo de espacio: ${params.spaceType}` : null,
    params.squareMeters ? `Metros cuadrados: ${params.squareMeters} m²` : null,
    params.productName ? `Producto: ${params.productName}` : null,
    params.message ? `Mensaje: ${params.message}` : null,
    "",
    "Ver en el panel: /dashboard/leads",
  ].filter((l): l is string => l !== null);

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFICATION_EMAIL,
      subject: `Nueva ${params.kind} — ${params.name}`,
      text: lines.join("\n"),
    });
  } catch (e) {
    // El lead ya está guardado; un email que falla no debe romper la UX del visitante.
    console.error("[email] notifyNewLead error:", e);
  }
}
