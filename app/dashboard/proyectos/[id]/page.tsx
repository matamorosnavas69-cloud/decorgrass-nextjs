import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/app/lib/authz";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { updateProject } from "@/app/lib/actions/projects";
import ProjectForm from "../ProjectForm";

export const metadata: Metadata = { title: "Editar proyecto — Dashboard" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProyectoPage({ params }: PageProps) {
  await requirePermission("projects:write");
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/proyectos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="h-4 w-4" /> Volver a proyectos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Editar {project.title}</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <ProjectForm project={project} action={updateProject.bind(null, id)} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
