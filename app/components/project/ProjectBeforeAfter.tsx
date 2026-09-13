import Image from "next/image";

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
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-80">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-900/70 px-3 py-1 text-xs font-medium text-white">
              Antes
            </span>
            <Image src={beforeImages[0]} alt={`${title} — antes`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-80">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-primary/90 px-3 py-1 text-xs font-medium text-white">
              Después
            </span>
            <Image src={afterImages[0]} alt={`${title} — después`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
