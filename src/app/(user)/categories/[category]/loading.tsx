//src/app/(user)/categories/[category]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in-50 duration-300">
      <div className="relative rounded-3xl bg-card/60 border border-border/60 p-6 sm:p-10 space-y-4 overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-3/4 sm:w-1/2 rounded-xl mt-3" />
          <Skeleton className="h-4 w-full sm:w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      <div className="space-y-4 border-b border-border/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-9 w-44 rounded-xl" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/60 bg-card overflow-hidden space-y-3 p-3"
          >
            <Skeleton className="w-full aspect-video rounded-xl" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="space-y-1 flex-1 min-w-0">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-16 rounded-md" />
              </div>
            </div>
            <div className="space-y-1.5 py-1">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <Skeleton className="h-4 w-14 rounded-md" />
              <div className="space-y-1 text-right">
                <Skeleton className="h-3 w-10 rounded-md ml-auto" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
