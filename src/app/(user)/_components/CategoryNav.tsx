"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const { data: categories, isLoading } =
    trpc.category.getAllWithSubcategories.useQuery(undefined, {
      staleTime: 1000 * 60 * 5, // Cache selama 5 menit
    });

  // 1. Deteksi Overflow menggunakan ResizeObserver API
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setIsOverflowing(hasOverflow);
    };

    // Jalankan pemeriksaan awal
    checkOverflow();

    // Monitor perubahan ukuran elemen/layar secara real-time
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [categories]);

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
    <div className="relative w-full">
      {/* Container Navigasi Kategori */}
      <div
        ref={containerRef}
        className={cn(
          "container mx-auto px-4 flex items-center py-2 text-sm text-muted-foreground whitespace-nowrap transition-all duration-200",
          isOverflowing
            ? "justify-start overflow-x-auto no-scrollbar gap-6"
            : "justify-around gap-4",
        )}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="hover:text-foreground transition-colors py-2 shrink-0"
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* 2. Indikator Gradient + ChevronRight HANYA Muncul Saat Overflow */}
      {isOverflowing && (
        <div
          className="absolute right-0 top-0 bottom-0 bg-gradient-to-l pointer-events-none from-background via-background/90 to-transparent pl-6 pr-2 flex items-center z-10"
          aria-hidden="true"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
}
