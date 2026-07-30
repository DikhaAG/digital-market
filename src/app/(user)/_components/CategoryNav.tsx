// src/app/(user)/_components/CategoryNavClient.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryNav() {
  const { data: categories, isLoading } =
    trpc.category.getAllWithSubcategories.useQuery(undefined, {
      staleTime: 1000 * 60 * 5, // Cache selama 5 menit
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 flex items-center gap-6 py-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24 shrink-0 rounded" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="container mx-auto px-4 relative flex items-center overflow-x-auto no-scrollbar py-2 text-sm text-muted-foreground whitespace-nowrap gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="hover:text-foreground transition-colors py-2 shrink-0"
        >
          {category.name}
        </Link>
      ))}

      <div className="sticky right-0 bg-gradient-to-l pointer-events-none from-background via-background/90 to-transparent pl-6 pr-2 flex items-center shrink-0">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
