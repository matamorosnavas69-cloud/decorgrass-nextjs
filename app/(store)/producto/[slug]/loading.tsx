export default function ProductoLoading() {
  return (
    <div className="container-max px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-stone-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100" />
          <div className="h-24 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
    </div>
  );
}
