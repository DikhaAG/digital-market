"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app";

type RouterOutput = inferRouterOutputs<AppRouter>;
type CategoryWithSubcategories =
  RouterOutput["category"]["getAllWithSubcategories"][number];

interface CategoryAccordionProps {
  onLinkClick?: () => void;
}

export function CategoryAccordion({ onLinkClick }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithSubcategories | null>(null);

  const utils = trpc.useUtils();

  // Query tRPC dengan Stale Time & Auto Prefetch
  const {
    data: categories = [],
    isLoading,
    isError,
  } = trpc.category.getAllWithSubcategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    enabled: isOpen,
  });

  // Prefetch data saat kursor mendekati/hover tombol utama
  const handlePrefetch = () => {
    utils.category.getAllWithSubcategories.prefetch(undefined, {
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-1"
      >
        <CollapsibleTrigger
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted text-foreground font-medium text-sm transition-colors text-left cursor-pointer"
        >
          <span>Jelajahi Kategori</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="pl-2 space-y-0.5 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {isLoading && <CategoryAccordionSkeleton />}

          {isError && (
            <p className="text-xs text-destructive p-3 font-medium">
              Gagal memuat kategori. Silakan coba lagi.
            </p>
          )}

          {!isLoading &&
            categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/80 text-foreground text-sm transition-colors text-left cursor-pointer group"
              >
                <span>{category.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
        </CollapsibleContent>
      </Collapsible>

      {/* SINGLE DYNAMIC SHEET (Menggantikan N-Sheet di dalam loop) */}
      <Sheet
        open={Boolean(selectedCategory)}
        onOpenChange={(open) => !open && setSelectedCategory(null)}
      >
        <SheetContent side="right" className="w-75 sm:w-87.5 p-0 flex flex-col">
          {selectedCategory && (
            <>
              <SheetHeader className="p-4 border-b border-border text-left flex-row items-center gap-2 space-y-0">
                <Layers className="h-4 w-4 text-primary shrink-0" />
                <SheetTitle className="text-base font-bold text-foreground truncate">
                  {selectedCategory.name}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <Link
                  href={`/categories/${selectedCategory.slug}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    onLinkClick?.();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg font-bold text-primary hover:bg-primary/10 transition-colors text-sm mb-2 border border-primary/20"
                >
                  <span>Lihat Semua {selectedCategory.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {selectedCategory.subcategories &&
                selectedCategory.subcategories.length > 0 ? (
                  selectedCategory.subcategories.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={`/categories/${selectedCategory.slug}/${subItem.slug}`}
                      onClick={() => {
                        setSelectedCategory(null);
                        onLinkClick?.();
                      }}
                      className="block p-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
                    >
                      {subItem.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground p-3 italic">
                    Belum ada sub-kategori.
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CategoryAccordionSkeleton() {
  return (
    <div className="space-y-1 py-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-lg" />
      ))}
    </div>
  );
}
