import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/app/lib/actions/projects";
import ProjectForm from "../ProjectForm";

export const metadata: Metadata = { title: "Nuevo proyecto — Dashboard" };

export default function NuevoProyectoPage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/proyectos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="h-4 w-4" /> Volver a proyectos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Nuevo proyecto</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <ProjectForm action={createProject} submitLabel="Crear proyecto" />
      </div>
    </div>
  );
}
