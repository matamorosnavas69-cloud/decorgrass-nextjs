import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ponytail: descripcion/imagenes/colores son placeholders, se completan luego desde el dashboard
type SeedProduct = {
  name: string;
  category: string;
  pricePerM2: number;
  fiberHeight: string;
};

const products: SeedProduct[] = [
  // PAISAJISMO VERDE
  { name: "Paisajismo 20mm Liviana (Basic o Essence) RE", category: "Paisajismo Verde", pricePerM2: 49000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Trafico Normal CCG", category: "Paisajismo Verde", pricePerM2: 56000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Pro Fibra Gruesa FE", category: "Paisajismo Verde", pricePerM2: 59000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Verde Verde Greener CU", category: "Paisajismo Verde", pricePerM2: 62000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Verde Lima FE", category: "Paisajismo Verde", pricePerM2: 62000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm CU", category: "Paisajismo Verde", pricePerM2: 62000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm (22mm) CUP", category: "Paisajismo Verde", pricePerM2: 71000, fiberHeight: "22mm" },
  { name: "Paisajismo 25mm Terrace RE", category: "Paisajismo Verde", pricePerM2: 59000, fiberHeight: "25mm" },
  { name: "Paisajismo 30mm CCG", category: "Paisajismo Verde", pricePerM2: 59000, fiberHeight: "30mm" },
  { name: "Paisajismo 30mm Vita RE", category: "Paisajismo Verde", pricePerM2: 62000, fiberHeight: "30mm" },
  { name: "Paisajismo 30mm Pesada CU", category: "Paisajismo Verde", pricePerM2: 94000, fiberHeight: "30mm" },
  { name: "Paisajismo 40mm CCG", category: "Paisajismo Verde", pricePerM2: 65000, fiberHeight: "40mm" },
  { name: "Paisajismo 40mm Pesada Trevi RE", category: "Paisajismo Verde", pricePerM2: 80000, fiberHeight: "40mm" },
  { name: "Paisajismo 55mm RE", category: "Paisajismo Verde", pricePerM2: 110000, fiberHeight: "55mm" },

  // PAISAJISMO DE COLORES
  { name: "Paisajismo 20mm Liviana Summer (rojo, negro, azul) RE", category: "Paisajismo de Colores", pricePerM2: 49000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Colors (fucsia, amarillo mostaza) CU", category: "Paisajismo de Colores", pricePerM2: 59000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Colores (azul, rojo, amarillo, morado, blanco) HEC CCG", category: "Paisajismo de Colores", pricePerM2: 59000, fiberHeight: "20mm" },
  { name: "Paisajismo 20mm Colores (13 tonos) FE", category: "Paisajismo de Colores", pricePerM2: 62000, fiberHeight: "20mm" },

  // CURLY
  { name: "Curly 14mm 750gr CU", category: "Curly", pricePerM2: 62000, fiberHeight: "14mm" },
  { name: "Curly 14mm 900gr CU", category: "Curly", pricePerM2: 78000, fiberHeight: "14mm" },

  // TENIS
  { name: "Tenis 20mm Verde (New Deluxe) CUP", category: "Tenis", pricePerM2: 53000, fiberHeight: "20mm" },
  { name: "Tenis 25mm Verde (New Deluxe) CUP", category: "Tenis", pricePerM2: 62000, fiberHeight: "25mm" },
  { name: "Tenis 20mm Colores (naranja, azul oscuro, amarillo) TAISH", category: "Tenis", pricePerM2: 67000, fiberHeight: "20mm" },
  { name: "Tenis 22mm Colores MUNDIG", category: "Tenis", pricePerM2: 67000, fiberHeight: "22mm" },
  { name: "Tenis o Padel Fibrilada 14mm (azul y blanco) HEC CCGR", category: "Tenis", pricePerM2: 78000, fiberHeight: "14mm" },

  // GOLF
  { name: "Golf Fibrilada 12mm CASA", category: "Golf", pricePerM2: 89000, fiberHeight: "12mm" },
  { name: "Golf Curly HEC CCG", category: "Golf", pricePerM2: 96000, fiberHeight: "14mm" },

  // TAPICESPED
  { name: "Tapicesped 10mm HEC CCG", category: "Tapicesped", pricePerM2: 34000, fiberHeight: "10mm" },
  { name: "Tapicesped 10mm FE", category: "Tapicesped", pricePerM2: 34000, fiberHeight: "10mm" },

  // FUTBOL
  { name: "Futbol 50mm Verde CCG", category: "Futbol", pricePerM2: 55000, fiberHeight: "50mm" },
  { name: "Futbol 50mm (amarilla y blanca) CCG", category: "Futbol", pricePerM2: 62000, fiberHeight: "50mm" },
];

async function main() {
  for (const p of products) {
    const slug = slugify(p.name);
    await prisma.grassProduct.upsert({
      where: { slug },
      update: {
        category: p.category,
        pricePerM2: p.pricePerM2,
        fiberHeight: p.fiberHeight,
      },
      create: {
        name: p.name,
        slug,
        category: p.category,
        pricePerM2: p.pricePerM2,
        fiberHeight: p.fiberHeight,
        description: "Descripción pendiente por completar.",
        shortDescription: "Descripción corta pendiente.",
        density: "Pendiente",
        toneColor: "Pendiente",
        guarantee: "Pendiente",
        images: [],
        uses: [],
        availableColors: [],
        availableHeights: [p.fiberHeight],
        benefits: [],
      },
    });
  }
  console.log(`Seed listo: ${products.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
