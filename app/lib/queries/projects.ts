import { prisma } from "@/app/lib/db";
import type { Project } from "@/app/lib/data";
import type { Project as PrismaProject } from "@prisma/client";

function toProject(row: PrismaProject): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    location: row.location,
    metersInstalled: row.metersInstalled,
    grassUsed: row.grassUsed,
    grassColor: row.grassColor,
    installationTime: row.installationTime,
    warranty: row.warranty,
    benefits: row.benefits,
    beforeImages: row.beforeImages,
    afterImages: row.afterImages,
    tags: row.tags,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { slug } });
  return row && row.published ? toProject(row) : null;
}

export async function getRelatedProjects(
  projectId: string,
  category: string,
  limit = 3
): Promise<Project[]> {
  const sameCategory = await prisma.project.findMany({
    where: { id: { not: projectId }, category, published: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  if (sameCategory.length >= limit) return sameCategory.map(toProject);

  const rest = await prisma.project.findMany({
    where: { id: { not: projectId }, category: { not: category }, published: true },
    take: limit - sameCategory.length,
    orderBy: { createdAt: "desc" },
  });
  return [...sameCategory, ...rest].map(toProject);
}
