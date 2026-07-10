import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://decorgrass.com"),
  title: {
    default: "Decorgrass — Grama Sintética Premium para tu Espacio",
    template: "%s | Decorgrass",
  },
  description:
    "Venta e instalación profesional de grama sintética decorativa, deportiva y pet friendly. Transforma tu jardín, terraza o balcón. Cotiza gratis por WhatsApp.",
  keywords: [
    "grama sintética",
    "césped artificial",
    "grama decorativa",
    "instalación grama sintética",
    "jardín artificial",
    "grama para terraza",
    "grama pet friendly",
    "grama deportiva",
    "Decorgrass",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Decorgrass",
    title: "Decorgrass — Grama Sintética Premium",
    description:
      "Transforma tu espacio con grama sintética de alta calidad. Instalación profesional en todo Colombia.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
