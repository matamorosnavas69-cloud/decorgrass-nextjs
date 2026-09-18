"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { requireAdmin } from "@/app/lib/auth";
import { parseProjectForm } from "@/app/lib/validations/project";

export type ProjectFormState = { error?: string };

export async function createProject(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  await requireAdmin();
  const { parsed, arrays } = parseProjectForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "Ya existe un proyecto con ese slug" };

  const project = await prisma.project.create({ data: { ...data, ...arrays } });

  revalidatePath("/dashboard/proyectos");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${project.slug}`);
  redirect("/dashboard/proyectos");
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  const { parsed, arrays } = parseProjectForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) return { error: "Ya existe otro proyecto con ese slug" };

  const project = await prisma.project.update({ where: { id }, data: { ...data, ...arrays } });

  revalidatePath("/dashboard/proyectos");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${project.slug}`);
  redirect("/dashboard/proyectos");
}

/** Despublica en vez de borrar — igual criterio que toggleProductAvailability. */
export async function toggleProjectPublished(id: string): Promise<void> {
  await requireAdmin();
  const project = await prisma.project.findUniqueOrThrow({ where: { id } });
  await prisma.project.update({ where: { id }, data: { published: !project.published } });

  revalidatePath("/dashboard/proyectos");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${project.slug}`);
}
