export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-stone-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-stone-200" />
        ))}
      </div>
    </div>
  );
}
