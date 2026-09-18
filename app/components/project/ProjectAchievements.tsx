import { CheckCircle2 } from "lucide-react";

interface ProjectAchievementsProps {
  benefits: string[];
}

export default function ProjectAchievements({ benefits }: ProjectAchievementsProps) {
  if (benefits.length === 0) return null;

  return (
    <section className="section-padding border-t border-stone-100 bg-stone-50">
      <div className="container-max">
        <h2 className="mb-8 text-2xl font-bold text-stone-900">¿Qué logramos?</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b} className="card flex items-start gap-3 p-5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-primary" />
              <p className="text-sm text-stone-700 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
