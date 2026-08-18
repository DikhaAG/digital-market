"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export interface ActiveFilterChipsProps {
  categorySlug?: string;
  minPrice?: string;
  maxPrice?: string;
  proServices?: boolean;
  selectedOptionIds?: string[];
  showCategoryChip?: boolean;
  onRemove: (key: string, valueToRemove?: string) => void;
}

export function ActiveFilterChips({
  categorySlug,
  minPrice,
  maxPrice,
  proServices,
  selectedOptionIds = [],
  showCategoryChip = true,
  onRemove,
}: ActiveFilterChipsProps) {
  const hasBudgetFilter = Boolean(minPrice || maxPrice);

  const { data: categories } = trpc.category.getAllWithSubcategories.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 5 },
  );

  const { data: attributes } = trpc.gig.getCategoryAttributes.useQuery(
    { categorySlug: categorySlug ?? "" },
    { enabled: Boolean(categorySlug && selectedOptionIds.length > 0) },
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

  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!attributes) return map;
    for (const attr of attributes) {
      for (const opt of attr.options) {
        map.set(opt.id, opt.label);
      }
    }
    return map;
  }, [attributes]);

  const shouldRenderCategory = showCategoryChip && categorySlug;

  if (
    !hasBudgetFilter &&
    !proServices &&
    !shouldRenderCategory &&
    selectedOptionIds.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {/* Category Active Chip */}
      {shouldRenderCategory && (
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

      {/* Attribute Options Active Chips */}
      {selectedOptionIds.map((optId) => {
        const label = optionMap.get(optId) ?? "Option";
        return (
          <span
            key={optId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 text-secondary-foreground border border-border/60 hover:bg-secondary transition-colors"
          >
            {label}
            <button
              type="button"
              onClick={() => onRemove("option", optId)}
              className="p-0.5 rounded-full hover:bg-background/80 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}
    </div>
  );
}
