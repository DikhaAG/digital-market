//src/components/filters/CategoryFilterPopover.tsx
"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CategoryFilterPopoverProps {
  selectedCategorySlug?: string;
  initialCategoryName?: string;
  isPending?: boolean;
  onSelectCategory: (categorySlug: string | null) => void;
}

export function CategoryFilterPopover({
  selectedCategorySlug,
  initialCategoryName,
  isPending,
  onSelectCategory,
}: CategoryFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  // Fetch daftar kategori dari tRPC (auto cached)
  const { data: categories, isLoading } =
    trpc.category.getAllWithSubcategories.useQuery(undefined, {
      staleTime: 1000 * 60 * 5,
    });

  // Resolusi nama kategori terpilih berdasarkan slug
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategorySlug || !categories) return null;

    for (const cat of categories) {
      if (cat.slug === selectedCategorySlug) return cat.name;
      const subMatch = cat.subcategories?.find(
        (sub) => sub.slug === selectedCategorySlug,
      );
      if (subMatch) return `${cat.name} > ${subMatch.name}`;
    }
    return null;
  }, [selectedCategorySlug, categories]);

  const displayCategoryName =
    selectedCategoryName ?? initialCategoryName ?? "Category";

  const handleSelect = (slug: string | null) => {
    setOpen(false);
    onSelectCategory(slug);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant={selectedCategorySlug ? "default" : "outline"}
            disabled={isPending}
            className={cn(
              "rounded-xl border-border font-semibold text-sm h-10 px-4 transition-all gap-2 cursor-pointer",
              selectedCategorySlug &&
                "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Layers className="h-4 w-4 opacity-70" />
            <span className="truncate max-w-40">{displayCategoryName}</span>
            <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
          </Button>
        }
      />
      <PopoverContent
        className="w-80 p-2 max-h-96 overflow-y-auto no-scrollbar rounded-2xl"
        align="start"
      >
        <div className="p-2 font-bold text-xs text-muted-foreground uppercase tracking-wider">
          Filter by Category
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2 p-2">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        )}

        {/* Categories Tree List */}
        {categories && (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={cn(
                "w-full flex items-center justify-between text-left text-sm font-semibold px-3 py-2 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer",
                !selectedCategorySlug && "bg-muted text-primary",
              )}
            >
              <span>All Categories</span>
              {!selectedCategorySlug && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>

            <div className="h-px bg-border my-1" />

            {categories.map((category) => {
              const isParentSelected = selectedCategorySlug === category.slug;

              return (
                <div key={category.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelect(category.slug)}
                    className={cn(
                      "w-full flex items-center justify-between text-left text-sm font-bold px-3 py-1.5 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer",
                      isParentSelected && "text-primary bg-primary/10",
                    )}
                  >
                    <span>{category.name}</span>
                    {isParentSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>

                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="pl-4 space-y-0.5 border-l-2 border-border/50 ml-3 my-0.5">
                        {category.subcategories.map((sub) => {
                          const isSubSelected =
                            selectedCategorySlug === sub.slug;

                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelect(sub.slug)}
                              className={cn(
                                "w-full flex items-center justify-between text-left text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground",
                                isSubSelected &&
                                  "text-primary font-bold bg-primary/10",
                              )}
                            >
                              <span>{sub.name}</span>
                              {isSubSelected && (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
