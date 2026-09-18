import { getRelatedProjects } from "@/app/lib/queries/projects";
import ProjectCard from "@/app/components/project/ProjectCard";

interface RelatedProjectsProps {
  projectId: string;
  category: string;
}

export default async function RelatedProjects({ projectId, category }: RelatedProjectsProps) {
  const projects = await getRelatedProjects(projectId, category);

  if (projects.length === 0) return null;

  return (
    <section className="section-padding border-t border-stone-100">
      <div className="container-max">
        <h2 className="mb-8 text-2xl font-bold text-stone-900">Proyectos relacionados</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
