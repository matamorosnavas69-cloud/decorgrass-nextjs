import { projects, type Project } from "@/app/lib/data";

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProjects(
  projectId: string,
  category: string,
  limit = 3
): Promise<Project[]> {
  const sameCategory = projects.filter((p) => p.id !== projectId && p.category === category);
  const rest = projects.filter((p) => p.id !== projectId && p.category !== category);
  return [...sameCategory, ...rest].slice(0, limit);
}
