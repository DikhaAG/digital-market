import { Suspense } from "react";
import { HeroSection } from "./_components/HeroSection";
import { PopularServices } from "./_components/PopularServices";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCards } from "./_components/CategoryCards";

export default function UserPage() {
  return (
    <div className="w-full space-y-12">
      <HeroSection />

      {/* 1. Kategori Utama (Icon Grid) */}
      <Suspense fallback={<CategoryCardsSkeleton />}>
        <CategoryCards />
      </Suspense>

      {/* 2. Sub-Kategori (Popular Services Cards) */}
      <Suspense fallback={<PopularServicesSkeleton />}>
        <PopularServices />
      </Suspense>
    </div>
  );
}

// Skeleton Loader untuk Kategori Utama
function CategoryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-[135px] w-full rounded-2xl" />
      ))}
    </div>
  );
}

// Skeleton Loader untuk Popular Services
function PopularServicesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="shrink-0 w-[170px] sm:w-[195px] h-[240px] sm:h-[265px] rounded-2xl sm:rounded-3xl"
          />
        ))}
      </div>
    </div>
  );
}
