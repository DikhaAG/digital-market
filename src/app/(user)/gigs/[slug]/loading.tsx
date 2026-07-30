import { Skeleton } from "@/components/ui/skeleton";

export default function GigLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-12 rounded" />
        <Skeleton className="h-3.5 w-20 rounded" />
        <Skeleton className="h-3.5 w-28 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Kolom Kiri */}
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-10 w-4/5 rounded-xl" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-4">
          <Skeleton className="h-[450px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
