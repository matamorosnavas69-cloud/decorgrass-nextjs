interface ProjectBeforeAfterProps {
  title: string;
  beforeImages: string[];
  afterImages: string[];
}

export default function ProjectBeforeAfter({ title, beforeImages, afterImages }: ProjectBeforeAfterProps) {
  if (beforeImages.length === 0 || afterImages.length === 0) return null;

  return (
    <section className="section-padding border-t border-stone-100">
      <div className="container-max">
        <h2 className="mb-8 text-2xl font-bold text-stone-900">Antes / Después</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-900/70 px-3 py-1 text-xs font-medium text-white">
              Antes
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeImages[0]} alt={`${title} — antes`} className="h-72 w-full object-cover sm:h-80" />
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-primary/90 px-3 py-1 text-xs font-medium text-white">
              Después
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImages[0]} alt={`${title} — después`} className="h-72 w-full object-cover sm:h-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
