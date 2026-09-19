export type GrassCategory =
  | "decorativa"
  | "deportiva"
  | "accesorios"
  | "paisajismo-verde"
  | "paisajismo-colores"
  | "curly"
  | "tenis"
  | "golf"
  | "tapicesped"
  | "futbol";
export type GrassUse =
  | "jardines"
  | "terrazas"
  | "balcones"
  | "pet-friendly"
  | "zonas-infantiles"
  | "deportiva"
  | "muros-verdes"
  | "general";

export interface GrassProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: GrassCategory;
  uses: GrassUse[];
  pricePerM2: number;
  fiberHeight: string;
  density: string;
  toneColor: string;
  availableHeights: string[];
  availableColors: string[];
  guarantee: string;
  badge?: string;
  badgeType?: "green" | "amber" | "stone";
  petFriendly: boolean;
  childFriendly: boolean;
  sportSuitable: boolean;
  benefits: string[];
  images: string[];
  available: boolean;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  metersInstalled: number;
  grassUsed: string;
  grassColor: string;
  installationTime: string;
  warranty: string;
  benefits: string[];
  beforeImages: string[];
  afterImages: string[];
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  projectType: string;
}

export const WHATSAPP_NUMBER = "573208523041";

export const INSTALLATION_PRICE_PER_M2 = 15000;

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    location: "Bucaramanga",
    rating: 5,
    text: "Quedé encantada con el resultado. La grama se ve completamente natural y la instalación fue impecable. El equipo fue muy profesional.",
    projectType: "Jardín residencial",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    location: "Bogotá",
    rating: 5,
    text: "Transformaron mi terraza por completo. El proceso fue rápido y el acabado es premium. Mis vecinos me preguntan dónde la conseguí.",
    projectType: "Terraza apartamento",
  },
  {
    id: "3",
    name: "Laura Jiménez",
    location: "Medellín",
    rating: 5,
    text: "La grama para la zona de juegos de mis hijos es perfecta. Segura, fácil de limpiar y se ve hermosa. 100% recomendada.",
    projectType: "Zona infantil",
  },
  {
    id: "4",
    name: "Andrés Ruiz",
    location: "Cali",
    rating: 4,
    text: "Excelente calidad del producto y muy buen precio. El tiempo de instalación fue el prometido. Muy satisfecho con el resultado.",
    projectType: "Jardín comercial",
  },
];

export const categories = [
  { id: "jardines", label: "Jardines", icon: "🌿", href: "/catalogo?uso=jardines" },
  { id: "terrazas", label: "Terrazas", icon: "🏠", href: "/catalogo?uso=terrazas" },
  { id: "balcones", label: "Balcones", icon: "🌱", href: "/catalogo?uso=balcones" },
  { id: "pet-friendly", label: "Mascotas", icon: "🐕", href: "/catalogo?uso=pet-friendly" },
  { id: "zonas-infantiles", label: "Niños", icon: "🧒", href: "/catalogo?uso=zonas-infantiles" },
  { id: "deportiva", label: "Deportiva", icon: "⚽", href: "/catalogo?uso=deportiva" },
  { id: "muros-verdes", label: "Muros Verdes", icon: "🌲", href: "/catalogo?uso=muros-verdes" },
  { id: "general", label: "Instalación", icon: "🔧", href: "/instalacion" },
] as const;

export const solutions = [
  {
    title: "Quiero renovar mi patio",
    description: "Transforma tu patio con grama sintética de alta calidad que luce natural todo el año.",
    icon: "🏡",
    href: "/catalogo?uso=jardines",
    image: "/proyectos/proyecto-1/despues-1.jpg",
  },
  {
    title: "Terraza más verde",
    description: "Convierte tu terraza o balcón en un oasis verde sin mantenimiento.",
    icon: "🌿",
    href: "/catalogo?uso=terrazas",
    image: "/soluciones/terraza.jpg",
  },
  {
    title: "Zona segura para niños",
    description: "Grama suave, acolchada y sin toxinas para que tus hijos jueguen tranquilos.",
    icon: "🧒",
    href: "/catalogo?uso=zonas-infantiles",
    image: "/soluciones/ninos.jpg",
  },
  {
    title: "Espacio pet friendly",
    description: "Materiales seguros para mascotas con drenaje eficiente y fácil limpieza.",
    icon: "🐕",
    href: "/catalogo?uso=pet-friendly",
    image: "/soluciones/mascotas.png",
  },
  {
    title: "Instalación comercial",
    description: "Proyectos a medida para locales, oficinas, centros comerciales y hoteles.",
    icon: "🏢",
    href: "/contacto",
    image: "/soluciones/comercial.jpg",
  },
  {
    title: "Cancha deportiva",
    description: "Canchas de fútbol, tenis y pádel con grama certificada y garantía de 5 años.",
    icon: "⚽",
    href: "/catalogo?uso=deportiva",
    image: "/soluciones/deportiva.png",
  },
];

export const benefits = [
  { icon: "✅", title: "Instalación profesional", description: "Equipo certificado con años de experiencia." },
  { icon: "🌿", title: "Materiales premium", description: "Grama de alta calidad resistente al sol y lluvia." },
  { icon: "💧", title: "Fácil mantenimiento", description: "Sin cortar, abonar ni regar. Solo limpiar ocasionalmente." },
  { icon: "🐕", title: "Ideal para mascotas", description: "Materiales no tóxicos y drenaje eficiente." },
  { icon: "💦", title: "Drenaje eficiente", description: "Sistema de drenaje integrado que evita encharcamientos." },
  { icon: "🎨", title: "Apariencia natural", description: "Fibras multitonales que imitan el césped real." },
  { icon: "📞", title: "Asesoría personalizada", description: "Te ayudamos a elegir la grama perfecta para tu espacio." },
  { icon: "⚡", title: "Cotización rápida", description: "Recibe tu cotización por WhatsApp en minutos." },
];

export const processSteps = [
  { step: "01", title: "Asesoría inicial", description: "Conversamos sobre tu espacio, necesidades y presupuesto." },
  { step: "02", title: "Medición del área", description: "Calculamos los metros cuadrados exactos para tu proyecto." },
  { step: "03", title: "Selección de grama", description: "Te ayudamos a elegir el tipo ideal según tu uso y gusto." },
  { step: "04", title: "Cotización", description: "Recibes una cotización detallada sin compromisos." },
  { step: "05", title: "Instalación profesional", description: "Nuestro equipo instala en el tiempo acordado." },
  { step: "06", title: "Entrega del espacio", description: "Entregamos tu espacio transformado y garantizado." },
];
