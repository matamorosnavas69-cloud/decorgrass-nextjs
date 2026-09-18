export default function CatalogoLoading() {
  return (
    <div className="container-max px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-100" />
        ))}
      </div>
    </div>
  );
}
