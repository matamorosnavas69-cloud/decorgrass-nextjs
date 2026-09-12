import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/app/lib/queries/projects";
import ProjectGallery from "@/app/components/project/ProjectGallery";
import ProjectDetails from "@/app/components/project/ProjectDetails";
import ProjectAchievements from "@/app/components/project/ProjectAchievements";
import ProjectBeforeAfter from "@/app/components/project/ProjectBeforeAfter";
import ProjectSpecsTable from "@/app/components/project/ProjectSpecsTable";
import ProjectLocation from "@/app/components/project/ProjectLocation";
import ProjectTrust from "@/app/components/project/ProjectTrust";
import ProjectCTA from "@/app/components/project/ProjectCTA";
import RelatedProjects from "@/app/components/project/RelatedProjects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyecto no encontrado" };

  return {
    title: `${project.title} — Proyecto realizado`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Decorgrass`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="pt-16">
      <div className="container-max px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-400">
          <Link href="/" className="hover:text-brand-primary">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/proyectos" className="hover:text-brand-primary">Proyectos</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-stone-700">{project.title}</span>
        </nav>
      </div>

      <div className="container-max px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProjectGallery images={project.afterImages} title={project.title} />
          <ProjectDetails project={project} />
        </div>
      </div>

      <ProjectAchievements benefits={project.benefits} />
      <ProjectBeforeAfter
        title={project.title}
        beforeImages={project.beforeImages}
        afterImages={project.afterImages}
      />
      <ProjectSpecsTable project={project} />
      <ProjectLocation location={project.location} />
      <ProjectTrust />
      <ProjectCTA title={project.title} />
      <RelatedProjects projectId={project.id} category={project.category} />
    </div>
  );
}
