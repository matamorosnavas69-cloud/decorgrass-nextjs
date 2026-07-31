export type GrassCategory = "decorativa" | "deportiva" | "accesorios";
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

export const products: GrassProduct[] = [
  {
    id: "1",
    name: "Tapicésped",
    slug: "tapicesped",
    description:
      "Grama sintética decorativa de fibra corta, ideal para cubrir superficies con un acabado limpio y uniforme. Perfecta para interiores, exhibidores comerciales y zonas de bajo tráfico.",
    shortDescription:
      "Grama de fibra corta para cubrir superficies con acabado limpio.",
    category: "decorativa",
    uses: ["jardines", "general"],
    pricePerM2: 42000,
    fiberHeight: "11 mm",
    density: "Media",
    toneColor: "Verde uniforme",
    availableHeights: ["11 mm"],
    availableColors: ["Verde"],
    guarantee: "6 meses",
    badge: "Económica",
    badgeType: "stone",
    petFriendly: false,
    childFriendly: true,
    sportSuitable: false,
    benefits: [
      "Fácil instalación",
      "Bajo costo",
      "Acabado uniforme",
      "Liviana y manejable",
    ],
    images: [
      "/productos/grama tapicesped/grama tapicesped (1).jpeg",
      "/productos/grama tapicesped/grama tapicesped (2).jpeg",
      "/productos/grama tapicesped/grama tapicesped (3).jpeg",
      "/productos/grama tapicesped/grama tapicesped (4).jpeg",
    ],
    available: true,
    featured: false,
  },
  {
    id: "2",
    name: "Grama Paisajismo",
    slug: "paisajismo",
    description:
      "Grama sintética de alta calidad para jardines, patios y terrazas residenciales. Sus fibras naturales en diferentes tonos dan una apariencia realista y atractiva. Ideal para transformar espacios exteriores.",
    shortDescription:
      "Grama premium para jardines y terrazas con apariencia ultra-realista.",
    category: "decorativa",
    uses: ["jardines", "terrazas", "balcones"],
    pricePerM2: 52000,
    fiberHeight: "20 - 55 mm",
    density: "Alta",
    toneColor: "Verde bicolor natural",
    availableHeights: ["20 mm", "30 mm", "40 mm", "55 mm"],
    availableColors: ["Verde natural", "Verde oscuro"],
    guarantee: "3 años",
    badge: "Más vendida",
    badgeType: "green",
    petFriendly: true,
    childFriendly: true,
    sportSuitable: false,
    benefits: [
      "Apariencia 100% natural",
      "Drenaje eficiente",
      "Resistente al sol",
      "Fácil mantenimiento",
    ],
    images: [
      "/productos/grama paisajismo/grama paisajimo.jpeg",
      "/productos/grama paisajismo/WhatsApp Image 2026-06-12 at 8.23.37 AM.jpeg",
      "/productos/grama paisajismo/WhatsApp Image 2026-06-12 at 8.23.37 AM (1).jpeg",
      "/productos/grama paisajismo/WhatsApp Image 2026-06-12 at 8.23.37 AM (2).jpeg",
      "/productos/grama paisajismo/WhatsApp Image 2026-06-12 at 8.23.37 AM (3).jpeg",
    ],
    available: true,
    featured: true,
  },
  {
    id: "3",
    name: "Grama Curly",
    slug: "curly",
    description:
      "Grama sintética rizada de diseño moderno disponible en múltiples colores. Perfecta para decoración de interiores, eventos, stands comerciales y proyectos creativos que requieren un toque diferente.",
    shortDescription:
      "Grama rizada decorativa en 8 colores para proyectos creativos.",
    category: "decorativa",
    uses: ["balcones", "terrazas", "general"],
    pricePerM2: 50000,
    fiberHeight: "20 mm",
    density: "Alta",
    toneColor: "Multicolor",
    availableHeights: ["20 mm"],
    availableColors: [
      "Verde",
      "Azul",
      "Rojo",
      "Amarillo",
      "Naranja",
      "Morado",
      "Rosa",
      "Blanco",
    ],
    guarantee: "3 años",
    badge: "Colores",
    badgeType: "amber",
    petFriendly: false,
    childFriendly: true,
    sportSuitable: false,
    benefits: [
      "8 colores disponibles",
      "Diseño único",
      "Ideal para eventos",
      "Resistente al desgaste",
    ],
    images: [
      "/productos/tangara grama curly/tangara grama curly (1).jpeg",
      "/productos/tangara grama curly/tangara grama curly (2).jpeg",
    ],
    available: true,
    featured: true,
  },
  {
    id: "4",
    name: "Grama Tenis",
    slug: "tenis",
    description:
      "Grama sintética especializada para canchas de tenis. Cumple con estándares deportivos internacionales, ofrece rebote uniforme del balón y máxima tracción. Disponible en colores de cancha profesional.",
    shortDescription: "Grama para canchas de tenis con rebote uniforme.",
    category: "deportiva",
    uses: ["deportiva"],
    pricePerM2: 68000,
    fiberHeight: "25 mm",
    density: "Muy alta",
    toneColor: "Verde / Azul / Terracota",
    availableHeights: ["25 mm"],
    availableColors: ["Verde", "Azul", "Terracota", "Gris", "Bordo", "Naranja"],
    guarantee: "3 años",
    badge: "Deportiva",
    badgeType: "stone",
    petFriendly: false,
    childFriendly: false,
    sportSuitable: true,
    benefits: [
      "Estándar internacional",
      "Rebote uniforme",
      "Alta tracción",
      "Resistente a UV",
    ],
    images: [
      "/productos/grama tennis/gramatenis (1).jpeg",
      "/productos/grama tennis/gramatenis (2).jpeg",
      "/productos/grama tennis/gramatenis (3).jpeg",
      "/productos/grama tennis/gramatenis (4).jpeg",
      "/productos/grama tennis/gramatenis (5).jpeg",
      "/productos/grama tennis/gramatenis (6).jpeg",
    ],
    available: true,
    featured: false,
  },
  {
    id: "5",
    name: "Grama Fútbol",
    slug: "futbol",
    description:
      "Grama sintética de alta performance para canchas de fútbol. Fibra larga y resistente que simula césped natural, con sistema de drenaje integrado y soporte para relleno de arena o caucho.",
    shortDescription: "Grama de alta performance para canchas de fútbol.",
    category: "deportiva",
    uses: ["deportiva"],
    pricePerM2: 78000,
    fiberHeight: "50 mm",
    density: "Muy alta",
    toneColor: "Verde FIFA",
    availableHeights: ["50 mm"],
    availableColors: ["Verde FIFA", "Verde Lima"],
    guarantee: "5 años",
    badge: "Premium",
    badgeType: "green",
    petFriendly: false,
    childFriendly: false,
    sportSuitable: true,
    benefits: [
      "Fibra larga resistente",
      "Drenaje integrado",
      "Compatible con relleno",
      "Garantía 5 años",
    ],
    images: [
      "/productos/tangara grama tennis/tangara grama tennis (1).jpeg",
      "/productos/tangara grama tennis/tangara grama tennis (2).jpeg",
      "/productos/tangara grama tennis/tangara grama tennis (3).jpeg",
      "/productos/tangara grama tennis/tangara grama tennis (4).jpeg",
      "/productos/tangara grama tennis/tangara grama tennis (5).jpeg",
    ],
    available: true,
    featured: true,
  },
  {
    id: "6",
    name: "Grama Pádel",
    slug: "padel",
    description:
      "Grama sintética diseñada específicamente para canchas de pádel. Fibra corta y compacta que garantiza velocidad de juego óptima y adherencia perfecta del calzado deportivo.",
    shortDescription: "Grama especializada para canchas de pádel.",
    category: "deportiva",
    uses: ["deportiva"],
    pricePerM2: 65000,
    fiberHeight: "12 mm",
    density: "Muy alta",
    toneColor: "Azul / Blanco",
    availableHeights: ["12 mm"],
    availableColors: ["Azul", "Blanco", "Verde"],
    guarantee: "3 años",
    badge: "Deportiva",
    badgeType: "stone",
    petFriendly: false,
    childFriendly: false,
    sportSuitable: true,
    benefits: [
      "Velocidad óptima de juego",
      "Alta adherencia",
      "Resistente al desgaste",
      "Fácil limpieza",
    ],
    images: [
      "/productos/grama tennis/gramatenis (4).jpeg",
      "/productos/grama tennis/gramatenis (5).jpeg",
      "/productos/grama tennis/gramatenis (6).jpeg",
    ],
    available: true,
    featured: false,
  },
  {
    id: "7",
    name: "Bandeja para Mascotas",
    slug: "bandeja-mascotas",
    description:
      "Sistema de bandeja con grama sintética pet friendly diseñado para mascotas en apartamentos y espacios sin jardín. Drenaje eficiente, fácil limpieza y materiales 100% seguros para animales.",
    shortDescription:
      "Sistema de baño para mascotas con grama sintética y drenaje.",
    category: "accesorios",
    uses: ["pet-friendly"],
    pricePerM2: 35000,
    fiberHeight: "Estándar",
    density: "Media",
    toneColor: "Verde",
    availableHeights: ["Estándar"],
    availableColors: ["Verde"],
    guarantee: "1 año",
    badge: "Pet Friendly",
    badgeType: "green",
    petFriendly: true,
    childFriendly: false,
    sportSuitable: false,
    benefits: [
      "100% seguro para mascotas",
      "Drenaje eficiente",
      "Fácil de limpiar",
      "Libre de tóxicos",
    ],
    images: [
      "/productos/bandeja para perros/918b4fa3-509c-4021-89b9-f3f0b3a39812.png",
      "/productos/bandeja para perros/c0a98667-3822-47ac-8b0e-b32226fcc64a.png",
    ],
    available: true,
    featured: true,
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Jardín residencial Bucaramanga",
    slug: "jardin-residencial-bucaramanga",
    description:
      "Transformación completa de jardín trasero de 120 m² con grama paisajismo de 40 mm.",
    category: "Residencial",
    location: "Bucaramanga, Santander",
    metersInstalled: 120,
    grassUsed: "Grama Paisajismo 40mm",
    beforeImages: [],
    afterImages: [
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_10.57.28_AM.jpeg",
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_10.57.31_AM.jpeg",
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_10.57.32_AM.jpeg",
    ],
    tags: ["jardín", "residencial", "paisajismo"],
  },
  {
    id: "2",
    title: "Terraza apartamento Bogotá",
    slug: "terraza-apartamento-bogota",
    description:
      "Instalación en terraza de 35 m² en edificio de apartamentos con grama Curly verde.",
    category: "Residencial",
    location: "Bogotá, Cundinamarca",
    metersInstalled: 35,
    grassUsed: "Grama Curly Verde",
    beforeImages: [],
    afterImages: [
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_10.57.33_AM.jpeg",
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_10.57.34_AM.jpeg",
      "/proyectos/luxury/WhatsApp_Image_2025-03-15_at_11.00.06_AM.jpeg",
    ],
    tags: ["terraza", "apartamento", "curly"],
  },
  {
    id: "3",
    title: "Cancha deportiva en azotea",
    slug: "cancha-deportiva-azotea",
    description:
      "Cancha multiuso en terraza de edificio con grama deportiva de alto tráfico, 200 m².",
    category: "Deportivo",
    location: "Medellín, Antioquia",
    metersInstalled: 200,
    grassUsed: "Grama Fútbol",
    beforeImages: [],
    afterImages: [
      "/proyectos/sports/WhatsApp_Image_2025-03-15_at_10.59.37_AM_(2).jpeg",
      "/proyectos/sports/WhatsApp_Image_2025-03-15_at_10.59.37_AM.jpeg",
      "/proyectos/sports/WhatsApp_Image_2025-03-15_at_10.59.37_AM_(1).jpeg",
    ],
    tags: ["deportivo", "pádel", "club"],
  },
  {
    id: "4",
    title: "Zona infantil conjunto residencial",
    slug: "zona-infantil-conjunto-residencial",
    description:
      "Cubrimiento de zona de juegos infantil con grama paisajismo segura y acolchada de 80 m².",
    category: "Infantil",
    location: "Cali, Valle del Cauca",
    metersInstalled: 80,
    grassUsed: "Grama Paisajismo 30mm",
    beforeImages: [],
    afterImages: [
      "/proyectos/parques/WhatsApp_Image_2025-03-15_at_5.41.46_PM_(1).jpeg",
      "/proyectos/parques/WhatsApp_Image_2025-03-15_at_5.41.46_PM_(3).jpeg",
      "/proyectos/parques/WhatsApp_Image_2025-03-15_at_5.41.47_PM.jpeg",
    ],
    tags: ["infantil", "conjunto", "zonas-juego"],
  },
];

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
    image: "/proyectos/proyecto-2/despues-1.jpg",
  },
  {
    title: "Zona segura para niños",
    description: "Grama suave, acolchada y sin toxinas para que tus hijos jueguen tranquilos.",
    icon: "🧒",
    href: "/catalogo?uso=zonas-infantiles",
    image: "/proyectos/proyecto-4/despues-1.jpg",
  },
  {
    title: "Espacio pet friendly",
    description: "Materiales seguros para mascotas con drenaje eficiente y fácil limpieza.",
    icon: "🐕",
    href: "/catalogo?uso=pet-friendly",
    image: "/productos/mascotas/bandeja-1.jpg",
  },
  {
    title: "Instalación comercial",
    description: "Proyectos a medida para locales, oficinas, centros comerciales y hoteles.",
    icon: "🏢",
    href: "/contacto",
    image: "/proyectos/proyecto-2/despues-1.jpg",
  },
  {
    title: "Cancha deportiva",
    description: "Canchas de fútbol, tenis y pádel con grama certificada y garantía de 5 años.",
    icon: "⚽",
    href: "/catalogo?uso=deportiva",
    image: "/proyectos/proyecto-3/despues-1.jpg",
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
