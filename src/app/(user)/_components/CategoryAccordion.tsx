"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app"; // Sesuaikan path AppRouter Anda

// Inference tipe data langsung dari tRPC Router
type RouterOutput = inferRouterOutputs<AppRouter>;
type CategoryWithSubcategories =
  RouterOutput["category"]["getAllWithSubcategories"][number];

interface CategoryAccordionProps {
  onLinkClick?: () => void;
}

export function CategoryAccordion({ onLinkClick }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch data kategori secara interaktif dengan caching 5 menit
  const {
    data: categories,
    isLoading,
    isError,
  } = trpc.category.getAllWithSubcategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    enabled: isOpen, // Optimasi: Query baru berjalan ketika accordion pertama kali dibuka
  });

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full cursor-pointer hover:text-foreground hover:bg-muted p-3 rounded-md transition-colors text-left"
      >
        <span className="font-medium text-foreground">Jelajahi Kategori</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-2 space-y-0.5">
          {/* 1. Loading State */}
          {isLoading && <CategoryAccordionSkeleton />}

          {/* 2. Error State */}
          {isError && (
            <p className="text-xs text-destructive p-3">
              Gagal memuat kategori. Silakan coba lagi.
            </p>
          )}

          {/* 3. Render Data Kategori */}
          {categories?.map((category) => (
            <CategorySubSheet
              key={category.id}
              category={category}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySubSheet({
  category,
  onLinkClick,
}: {
  category: CategoryWithSubcategories;
  onLinkClick?: () => void;
}) {
  const subCategories = category.subcategories ?? [];

  return (
    <Sheet>
      {/* Fix: Menggunakan asChild untuk komponen pemicu Radix UI / Shadcn */}
      <SheetTrigger
        render={
          <button
            type="button"
            className="flex items-center justify-between w-full hover:text-foreground hover:bg-muted/80 p-3 rounded-md transition-colors text-left text-foreground text-sm font-normal cursor-pointer"
          >
            <span>{category.name}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        }
      ></SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] sm:w-[350px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border text-left">
          <SheetTitle className="text-base font-bold text-foreground">
            {category.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Link ke Halaman Utama Kategori Induk */}
          <Link
            href={`/categories/${category.slug}`}
            onClick={onLinkClick}
            className="flex items-center justify-between p-3 rounded-md font-semibold text-primary hover:bg-muted transition-colors text-sm mb-2 border-b border-border/50"
          >
            <span>Lihat Semua {category.name}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Render Sub-kategori */}
          {subCategories.length > 0 ? (
            subCategories.map((subItem) => (
              <Link
                key={subItem.id}
                href={`/categories/${subItem.slug}`}
                onClick={onLinkClick}
                className="block p-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {subItem.name}
              </Link>
            ))
          ) : (
            <p className="text-xs text-muted-foreground p-3">
              Belum ada sub-kategori.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Komponen Skeleton untuk mencegah Layout Shift (CLS)
function CategoryAccordionSkeleton() {
  return (
    <div className="space-y-1 py-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}
