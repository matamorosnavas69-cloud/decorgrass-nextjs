import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WHATSAPP_NUMBER, INSTALLATION_PRICE_PER_M2 } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export interface QuoteData {
  name?: string;
  phone?: string;
  spaceType?: string;
  squareMeters?: number;
  city?: string;
  installationNeeded?: boolean;
  productName?: string;
  pricePerM2?: number;
  totalPrice?: number;
  message?: string;
}

export function buildWhatsAppURL(data: QuoteData): string {
  const lines: string[] = ["🌿 *SOLICITUD DE COTIZACIÓN - DECORGRASS*", ""];

  if (data.name) lines.push(`👤 *Nombre:* ${data.name}`);
  if (data.spaceType) lines.push(`📍 *Tipo de espacio:* ${data.spaceType}`);
  if (data.squareMeters) lines.push(`📐 *Metros cuadrados:* ${data.squareMeters} m²`);
  if (data.city) lines.push(`🏙️ *Ciudad:* ${data.city}`);
  if (data.productName) lines.push(`🌱 *Producto de interés:* ${data.productName}`);
  if (data.installationNeeded !== undefined)
    lines.push(`🔧 *Instalación:* ${data.installationNeeded ? "Sí, la requiero" : "No, solo el material"}`);
  if (data.totalPrice) lines.push(`💰 *Presupuesto estimado:* ${formatCOP(data.totalPrice)}`);
  if (data.message) lines.push(`\n💬 *Mensaje:* ${data.message}`);

  lines.push("", "¡Quedo atento a su respuesta! 🙏");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export interface QuoteResult {
  materialTotal: number;
  installationTotal: number;
  grandTotal: number;
  pricePerM2: number;
  installationPricePerM2: number;
  squareMeters: number;
}

export function calculateQuote(
  squareMeters: number,
  pricePerM2: number,
  includeInstallation: boolean = true
): QuoteResult {
  const materialTotal = squareMeters * pricePerM2;
  const installationTotal = includeInstallation
    ? squareMeters * INSTALLATION_PRICE_PER_M2
    : 0;
  return {
    materialTotal,
    installationTotal,
    grandTotal: materialTotal + installationTotal,
    pricePerM2,
    installationPricePerM2: INSTALLATION_PRICE_PER_M2,
    squareMeters,
  };
}

export function getWhatsAppContactURL(message?: string): string {
  const text = message
    ? encodeURIComponent(message)
    : encodeURIComponent("Hola Decorgrass, me gustaría recibir más información sobre la grama sintética.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
