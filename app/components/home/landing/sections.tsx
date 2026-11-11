import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Droplet,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sun,
  Waves,
} from "lucide-react";
import { processSteps, WHATSAPP_NUMBER } from "@/app/lib/data";
import { getAllProjects } from "@/app/lib/queries/projects";
import { getWhatsAppContactURL } from "@/app/lib/utils";
import HeroPhoto from "./HeroPhoto";
import LeadForm from "./LeadForm";

// Una sola familia de iconos: lucide, trazo 1.5, decorativos (el texto ya dice lo mismo).
const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

// "573208523041" → "+57 320 852 3041"
const WHATSAPP_DISPLAY = WHATSAPP_NUMBER.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");

/** CTA de WhatsApp con mensaje propio por sección; `data-*` deja listo el seguimiento de clics. */
function WhatsAppCTA({
  section,
  message,
  children,
  className = "btn-hero",
}: {
  section: string;
  message: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={getWhatsAppContactURL(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-track="whatsapp_click"
      data-section={section}
    >
      <MessageCircle className="h-[18px] w-[18px]" {...ICON} />
      {children}
    </a>
  );
}

/* ── 01 · Presentación ─────────────────────────────────────────── */

export function HeroInicio() {
  return (
    <section id="inicio" className="hero flex-col justify-end">
      <HeroPhoto
        src="/landing/inicio.jpg"
        mobileSrc="/landing/inicio-m.jpg"
        alt="Franjas de grama sintética entre el adoquinado del acceso de una vivienda moderna"
        priority
      />
      <div className="veil veil-b lg:veil-l" aria-hidden />

      <div className="relative flex max-w-[41rem] flex-col gap-6">
        <p className="hero-eyebrow flex items-center gap-3">
          <span className="h-px w-7 bg-brand-lime" aria-hidden />
          Instalación profesional en toda Colombia
        </p>
        <h1 className="hero-title lg:text-[4.875rem] lg:leading-[1.03]">
          Transforma tu espacio con grama sintética
        </h1>
        <p className="hero-lead max-w-[32.5rem] text-white/90">
          Jardines, terrazas, balcones y canchas deportivas. Te orientamos sobre el producto y el
          alcance de instalación para cada proyecto.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
          <a href="#contacto" className="btn-hero" data-track="cta_click" data-section="inicio">
            Cotizar mi proyecto
            <ArrowRight className="h-[18px] w-[18px]" {...ICON} />
          </a>
          <Link href="/proyectos" className="link-hero self-center sm:self-auto">
            Ver proyectos
          </Link>
        </div>
        <ul className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/90">
          {["Sin contrato mínimo", "Cotización gratuita", "Condiciones informadas por proyecto"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-lime" {...ICON} />
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}

/* ── 02 · Grama decorativa ─────────────────────────────────────── */

const decorativaBenefits = [
  { icon: Sun, title: "Fácil mantenimiento", text: "Sin cortar, abonar ni regar. Solo limpiar ocasionalmente." },
  { icon: Droplet, title: "Drenaje eficiente", text: "Sistema de drenaje integrado que evita encharcamientos." },
  { icon: Leaf, title: "Apariencia natural", text: "Fibras multitonales que imitan el césped real." },
];

export function HeroDecorativa() {
  return (
    <section id="decorativa" className="hero flex-col justify-end gap-8 lg:justify-between lg:gap-12">
      <HeroPhoto
        src="/landing/decorativa.jpg"
        mobileSrc="/landing/decorativa-m.jpg"
        alt="Terraza con grama sintética decorativa, jardinera de piedras blancas y vista a las montañas"
      />
      <div className="veil veil-b-tall lg:veil-lb" aria-hidden />

      <div className="relative flex max-w-[40rem] flex-col gap-5">
        <p className="hero-eyebrow">01 — Grama decorativa</p>
        <h2 className="hero-title">Terrazas y balcones con vista y confort</h2>
        <p className="hero-lead max-w-[31rem] text-white/90">
          Convierte cualquier balcón o azotea en un espacio verde, sin mantenimiento y listo para
          disfrutar todo el año.
        </p>
        <p className="text-[13px] tracking-wide text-white/90">
          Jardines · Terrazas · Balcones · Pet friendly · Muros verdes
        </p>
      </div>

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <ul className="grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-3">
          {decorativaBenefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3 border-white/50 sm:flex-col sm:items-start sm:border-t sm:pt-4">
              <Icon className="h-[22px] w-[22px] shrink-0" {...ICON} />
              <div>
                <strong className="text-[15px] font-medium">{title}</strong>
                <p className="mt-1 hidden text-sm leading-normal text-white/90 sm:block">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7 lg:flex-col lg:items-start lg:gap-2">
          <WhatsAppCTA section="decorativa" message="Hola, me interesa cotizar grama decorativa para mi proyecto.">
            Cotizar grama decorativa
          </WhatsAppCTA>
          <Link href="/catalogo?categoria=paisajismo-verde" className="link-hero self-center sm:self-auto">
            Ver catálogo decorativo
            <ArrowRight className="h-4 w-4" {...ICON} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 03 · Parques infantiles ───────────────────────────────────── */

const parquesPoints = [
  { icon: Building2, text: "Parques infantiles en terrazas y azoteas" },
  { icon: ShieldCheck, text: "Opciones de grama suave y acolchada" },
  { icon: Waves, text: "Fácil de limpiar y mantener" },
];

export function HeroParques() {
  return (
    <section id="parques" className="hero flex-col justify-end">
      <HeroPhoto
        src="/landing/parques.jpg"
        mobileSrc="/landing/parques-m.jpg"
        alt="Parque infantil con grama sintética de colores bajo los juegos"
      />
      <div className="veil veil-b" aria-hidden />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="flex max-w-[40rem] flex-col gap-5">
          <p className="hero-eyebrow">02 — Parques infantiles</p>
          <h2 className="hero-title">Zonas seguras para que jueguen</h2>
          <p className="hero-lead max-w-[32.5rem] text-white/90">
            Grama suave y resistente, ideal para parques infantiles y zonas de juego. Consulta la
            ficha técnica de cada referencia.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
            <WhatsAppCTA section="parques" message="Hola, me interesa cotizar un parque infantil.">
              Cotizar parque infantil
            </WhatsAppCTA>
            <Link href="/catalogo?uso=zonas-infantiles" className="link-hero self-center sm:self-auto">
              Ver grama para parques
            </Link>
          </div>
        </div>
        <ul className="hidden w-full max-w-[25rem] shrink-0 border-b border-white/50 text-[15px] sm:block">
          {parquesPoints.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4 border-t border-white/50 py-[18px]">
              <Icon className="h-[22px] w-[22px] shrink-0" {...ICON} />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 04 · Grama deportiva ──────────────────────────────────────── */

const deportivaSpecs = [
  { term: "Aplicaciones", detail: "Fútbol · Tenis · Pádel · Golf" },
  { term: "Fibra", detail: "Alta densidad, diseñada para el tráfico intenso" },
  { term: "Instalación", detail: "Alcance, materiales y condiciones definidos para cada proyecto" },
];

export function HeroDeportiva() {
  return (
    <section id="deportiva" className="hero items-end lg:items-start lg:justify-end">
      <HeroPhoto
        src="/landing/deportiva.jpg"
        mobileSrc="/landing/deportiva-m.jpg"
        alt="Cancha de fútbol en grama sintética al atardecer"
      />
      <div className="veil veil-b lg:veil-r" aria-hidden />

      <div className="relative flex w-full flex-col gap-5 lg:max-w-[29.5rem]">
        <p className="hero-eyebrow">03 — Grama deportiva</p>
        <h2 className="hero-title lg:text-[3.625rem]">Canchas deportivas de nivel profesional</h2>
        <p className="hero-lead text-white/90">
          Opciones de grama para fútbol, tenis, golf y otros usos deportivos, sujetas a
          disponibilidad y ficha técnica.
        </p>
        {/* En móvil basta la línea de aplicaciones; la tabla completa entra desde sm */}
        <p className="text-[13px] tracking-wide text-white/90 sm:hidden">{deportivaSpecs[0].detail}</p>
        <dl className="mt-2 hidden border-b border-white/50 text-sm sm:block">
          {deportivaSpecs.map(({ term, detail }) => (
            <div key={term} className="flex gap-5 border-t border-white/50 py-4">
              <dt className="w-[7.5rem] shrink-0 pt-0.5 text-xs uppercase tracking-[0.16em] text-white/85">
                {term}
              </dt>
              <dd className="leading-normal">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
          <WhatsAppCTA section="deportiva" message="Hola, quiero asesoría para una cancha deportiva.">
            Solicitar asesoría deportiva
          </WhatsAppCTA>
          <Link href="/catalogo?uso=deportiva" className="link-hero self-center sm:self-auto">
            Ver grama deportiva
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 05 · Proceso ──────────────────────────────────────────────── */
// En móvil la foto es solo la cabecera y los pasos van sobre arena; en escritorio
// la cabecera pasa a `static` y la foto cubre toda la sección.

export function HeroProceso() {
  return (
    <section id="proceso" className="relative overflow-hidden bg-brand-sand text-brand-deep lg:min-h-[100svh]">
      {/* pb-36 en móvil: el texto queda sobre el cielo y las personas se ven debajo */}
      <div className="relative px-5 pb-36 pt-24 sm:px-8 lg:static lg:px-[4.5rem] lg:pb-14 lg:pt-28">
        <HeroPhoto
          src="/landing/proceso.jpg"
          alt="Dos personas revisan una terraza recién instalada con grama sintética y vista al valle"
        />
        <div className="veil veil-light" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <p className="hero-eyebrow text-brand-primary">Proceso</p>
            <h2 className="hero-title">Así trabajamos</h2>
            <p className="hero-lead text-[#37524c]">Simple, transparente y sin sorpresas.</p>
          </div>
          <a href="#contacto" className="btn-hero-dark hidden lg:inline-flex" data-track="cta_click" data-section="proceso">
            Empezar mi proyecto
            <ArrowRight className="h-[18px] w-[18px]" {...ICON} />
          </a>
        </div>
      </div>

      <div className="relative flex flex-col gap-8 px-5 pb-10 sm:px-8 lg:px-[4.5rem]">
        <ol className="grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-7">
          {processSteps.map((step) => (
            <li key={step.step} className="flex flex-col gap-2 border-t border-brand-deep pt-4">
              <span className="text-[13px] font-medium tracking-[0.14em] text-brand-primary">{step.step}</span>
              <strong className="font-medium">{step.title}</strong>
              <p className="text-sm leading-normal text-[#37524c]">{step.description}</p>
            </li>
          ))}
        </ol>
        <a href="#contacto" className="btn-hero-dark lg:hidden" data-track="cta_click" data-section="proceso">
          Empezar mi proyecto
        </a>
      </div>
    </section>
  );
}

/* ── 06 · Proyectos reales ─────────────────────────────────────── */

export async function HeroProyectos() {
  const projects = (await getAllProjects()).filter((p) => p.afterImages[0]).slice(0, 4);

  return (
    <section id="proyectos" className="hero flex-col justify-between gap-12">
      <HeroPhoto
        src="/landing/proyectos.jpg"
        mobileSrc="/landing/proyectos-m.jpg"
        alt="Putting green de grama sintética en la terraza de un edificio residencial"
      />
      <div className="veil veil-tb" aria-hidden />

      <div className="relative flex max-w-[37.5rem] flex-col gap-5">
        <p className="hero-eyebrow">Proyectos reales</p>
        <h2 className="hero-title">Proyectos instalados</h2>
        <p className="hero-lead text-white/90">
          Espacios reales transformados con grama sintética Decorgrass.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <ul className="scrollbar-hide -mx-5 flex gap-4 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:gap-5">
          {projects.map((project) => (
            <li key={project.id} className="w-[9.5rem] shrink-0 lg:w-[13rem]">
              <Link href={`/proyectos/${project.slug}`} className="group flex flex-col gap-3 text-sm font-medium">
                <span className="relative block aspect-[3/2] overflow-hidden rounded-sm">
                  <Image
                    src={project.afterImages[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 208px, 152px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </span>
                <span className="line-clamp-2 leading-snug">{project.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/proyectos" className="btn-hero shrink-0" data-track="cta_click" data-section="proyectos">
          Ver todos los proyectos
          <ArrowRight className="h-[18px] w-[18px]" {...ICON} />
        </Link>
      </div>
    </section>
  );
}

/* ── 07 · Contacto y conversión ────────────────────────────────── */
// Mismo recurso que Proceso: foto de cabecera en móvil, a sangre en escritorio.

export function HeroContacto() {
  return (
    <section
      id="contacto"
      className="relative scroll-mt-16 overflow-hidden bg-brand-sand lg:flex lg:min-h-[100svh] lg:items-end lg:justify-between lg:gap-10 lg:px-[4.5rem] lg:pb-24 lg:pt-28"
    >
      <div className="relative flex min-h-[20rem] flex-col justify-end px-5 pb-8 pt-24 text-white sm:px-8 lg:static lg:min-h-0 lg:max-w-[35rem] lg:p-0">
        <HeroPhoto
          src="/landing/contacto.jpg"
          alt="Terraza con grama sintética, materas y vista a las montañas"
        />
        <div className="veil veil-b" aria-hidden />
        <div className="relative flex flex-col gap-5">
          <p className="hero-eyebrow">Contacto</p>
          <h2 className="hero-title">Cotiza tu proyecto gratis</h2>
          <p className="hero-lead text-white/90">
            Completa el formulario y recibe tu cotización por WhatsApp en minutos.
          </p>
          <WhatsAppCTA
            section="contacto"
            message="Hola, quiero hablar con un asesor de Decorgrass."
            className="link-hero self-start"
          >
            Hablar con un asesor · {WHATSAPP_DISPLAY}
          </WhatsAppCTA>
        </div>
      </div>

      <div className="relative bg-brand-sand px-5 py-8 text-brand-deep sm:px-8 lg:w-[29.5rem] lg:shrink-0 lg:rounded-sm lg:p-10">
        <LeadForm />
      </div>
    </section>
  );
}
