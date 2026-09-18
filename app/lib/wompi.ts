import { createHash } from "node:crypto";

// Algoritmos confirmados contra la documentación oficial de Wompi
// (docs.wompi.co, verificado sep. 2026) — no asumidos de memoria.

/**
 * Firma de integridad del Widget Checkout:
 * SHA256(reference + amountInCents + currency + integritySecret), hex.
 * Se genera en el servidor — el integrity secret nunca llega al cliente.
 */
export function buildWompiIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  currency: string;
}): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error("WOMPI_INTEGRITY_SECRET no está configurada");

  const raw = `${params.reference}${params.amountInCents}${params.currency}${secret}`;
  return createHash("sha256").update(raw).digest("hex");
}

interface WompiWebhookPayload {
  event: string;
  data: Record<string, unknown>;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at: string;
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

/**
 * Verifica el checksum de un evento de Wompi:
 * SHA256(valores de signature.properties concatenados en orden + timestamp + eventsSecret), hex.
 * Comparar esto ANTES de confiar en el payload — es lo único que prueba
 * que el webhook lo mandó Wompi y no un tercero simulando el POST.
 */
export function verifyWompiWebhookChecksum(payload: WompiWebhookPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return false;

  const concatenated = payload.signature.properties
    .map((prop) => String(getByPath(payload.data, prop) ?? ""))
    .join("");

  const raw = `${concatenated}${payload.timestamp}${secret}`;
  const expected = createHash("sha256").update(raw).digest("hex");

  return expected === payload.signature.checksum;
}

export type { WompiWebhookPayload };
