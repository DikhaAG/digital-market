"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

interface ActiveFilterChipsProps {
  categorySlug?: string;
  minPrice?: string;
  maxPrice?: string;
  proServices?: boolean;
  onRemove: (key: string) => void;
}

export function ActiveFilterChips({
  categorySlug,
  minPrice,
  maxPrice,
  proServices,
  onRemove,
}: ActiveFilterChipsProps) {
  const hasBudgetFilter = Boolean(minPrice || maxPrice);

  const { data: categories } = trpc.category.getAllWithSubcategories.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 5 },
  );

  const categoryName = useMemo(() => {
    if (!categorySlug || !categories) return null;
    for (const cat of categories) {
      if (cat.slug === categorySlug) return cat.name;
      const subMatch = cat.subcategories?.find(
        (sub) => sub.slug === categorySlug,
      );
      if (subMatch) return subMatch.name;
    }
    return categorySlug;
  }, [categorySlug, categories]);

  if (!hasBudgetFilter && !proServices && !categorySlug) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category Active Chip */}
      {categorySlug && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
          Category: {categoryName}
          <button
            type="button"
            onClick={() => onRemove("category")}
            className="p-0.5 rounded-full hover:bg-primary/30 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Budget Active Chip */}
      {hasBudgetFilter && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted/80 text-foreground border border-border/60 hover:bg-muted transition-colors">
          {maxPrice
            ? `Under $${maxPrice}`
            : minPrice
              ? `Min $${minPrice}`
              : "Budget"}
          <button
            type="button"
            onClick={() => onRemove("budget")}
            className="p-0.5 rounded-full hover:bg-background/80 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Pro Services Active Chip */}
      {proServices && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted/80 text-foreground border border-border/60 hover:bg-muted transition-colors">
          Pro Services
          <button
            type="button"
            onClick={() => onRemove("pro")}
            className="p-0.5 rounded-full hover:bg-background/80 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
}
