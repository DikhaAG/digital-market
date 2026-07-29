import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div
      className="w-full space-y-12 pb-16 animate-pulse"
      aria-busy="true"
      aria-label="Loading category page"
    >
      {/* ================= 1. HERO BANNER SKELETON ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/10 via-card to-background p-6 sm:p-10 lg:p-12 shadow-md border border-brand/10">
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-12 rounded" />
            <span className="text-xs text-muted-foreground/30">/</span>
            <Skeleton className="h-3.5 w-20 rounded" />
            <span className="text-xs text-muted-foreground/30">/</span>
            <Skeleton className="h-3.5 w-28 rounded" />
          </div>

          {/* Badge & Title Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-56 rounded-full bg-brand/10" />
            <Skeleton className="h-10 sm:h-12 lg:h-14 w-3/4 rounded-xl" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-full max-w-xl rounded" />
              <Skeleton className="h-4 w-4/5 max-w-md rounded" />
            </div>
          </div>

          {/* Trust Stats Skeleton */}
          <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-border/40">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full bg-brand/40" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-3.5 w-36 rounded" />
          </div>
        </div>

        {/* Decorative Glow Shapes Skeleton */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
      </section>

      {/* ================= 2. POPULAR KEYWORDS SKELETON ================= */}
      <section className="space-y-3">
        <Skeleton className="h-7 w-56 rounded-lg" />

        {/* Horizontal Pills Skeleton */}
        <div className="flex items-center gap-2.5 overflow-hidden py-1">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 h-[42px] w-40"
            >
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 flex-1 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. EXPLORE GRID SKELETON ================= */}
      <section className="space-y-6">
        <Skeleton className="h-7 w-64 rounded-lg" />

        {/* Grid Cards Skeleton (8 Items - 4 Columns Grid Alignment) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm h-[320px]"
            >
              {/* Header Box Skeleton */}
              <div className="h-28 bg-muted/60 p-4 flex flex-col justify-end space-y-2 border-b border-border/40">
                <Skeleton className="h-5 w-3/4 rounded bg-background/50" />
                <Skeleton className="h-3 w-1/2 rounded bg-background/40" />
              </div>

              {/* Sub-links List Skeleton */}
              <div className="p-4 flex-1 space-y-3.5">
                {Array.from({ length: 5 }).map((_, itemIdx) => (
                  <Skeleton
                    key={itemIdx}
                    className="h-3.5 rounded"
                    style={{ width: `${85 - itemIdx * 10}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
