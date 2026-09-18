/**
 * Migra el catálogo hardcodeado de app/lib/data.ts hacia PostgreSQL.
 * Upsert por slug: data.ts es la fuente autoritativa, así que sobreescribe
 * cualquier fila existente con el mismo slug (p.ej. la sembrada por seed.ts).
 *
 * Uso: npx tsx prisma/migrate-catalog.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { products, projects } from "../app/lib/data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  let productsUpserted = 0;
  for (const p of products) {
    await prisma.grassProduct.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        category: p.category,
        pricePerM2: p.pricePerM2,
        fiberHeight: p.fiberHeight,
        density: p.density,
        toneColor: p.toneColor,
        availableHeights: p.availableHeights,
        availableColors: p.availableColors,
        guarantee: p.guarantee,
        badge: p.badge ?? null,
        badgeType: p.badgeType ?? null,
        petFriendly: p.petFriendly,
        childFriendly: p.childFriendly,
        sportSuitable: p.sportSuitable,
        benefits: p.benefits,
        images: p.images,
        uses: p.uses,
        available: p.available,
        featured: p.featured,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        category: p.category,
        pricePerM2: p.pricePerM2,
        fiberHeight: p.fiberHeight,
        density: p.density,
        toneColor: p.toneColor,
        availableHeights: p.availableHeights,
        availableColors: p.availableColors,
        guarantee: p.guarantee,
        badge: p.badge ?? null,
        badgeType: p.badgeType ?? null,
        petFriendly: p.petFriendly,
        childFriendly: p.childFriendly,
        sportSuitable: p.sportSuitable,
        benefits: p.benefits,
        images: p.images,
        uses: p.uses,
        available: p.available,
        featured: p.featured,
      },
    });
    productsUpserted++;
  }

  let projectsUpserted = 0;
  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {
        title: proj.title,
        description: proj.description,
        category: proj.category,
        location: proj.location,
        metersInstalled: proj.metersInstalled,
        grassUsed: proj.grassUsed,
        grassColor: proj.grassColor,
        installationTime: proj.installationTime,
        warranty: proj.warranty,
        benefits: proj.benefits,
        beforeImages: proj.beforeImages,
        afterImages: proj.afterImages,
        tags: proj.tags,
        published: true,
      },
      create: {
        slug: proj.slug,
        title: proj.title,
        description: proj.description,
        category: proj.category,
        location: proj.location,
        metersInstalled: proj.metersInstalled,
        grassUsed: proj.grassUsed,
        grassColor: proj.grassColor,
        installationTime: proj.installationTime,
        warranty: proj.warranty,
        benefits: proj.benefits,
        beforeImages: proj.beforeImages,
        afterImages: proj.afterImages,
        tags: proj.tags,
        published: true,
      },
    });
    projectsUpserted++;
  }

  const productCount = await prisma.grassProduct.count();
  const projectCount = await prisma.project.count();

  console.log(`Productos procesados: ${productsUpserted} (data.ts) / ${productCount} (total en DB)`);
  console.log(`Proyectos procesados: ${projectsUpserted} (data.ts) / ${projectCount} (total en DB)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
