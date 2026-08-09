"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSearchFilterParams } from "./hooks/useSearchFilterParams";
import { CategoryFilterPopover } from "./CategoryFilterPopover";
import { BudgetFilterPopover } from "./BudgetFilterPopover";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { SortBySelect } from "./SortBySelect";

interface SearchFiltersProps {
  totalResults: number;
}

export function SearchFilters({ totalResults }: SearchFiltersProps) {
  const {
    categorySlug,
    minPrice,
    maxPrice,
    sortBy,
    proServices,
    isPending,
    updateFilters,
    removeFilterChip,
  } = useSearchFilterParams();

  return (
    <div className="space-y-4">
      {/* BARIS 1: Dropdown Filters & Pro Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Popover Filter Kategori Berdasarkan Slug */}
          <CategoryFilterPopover
            selectedCategorySlug={categorySlug}
            isPending={isPending}
            onSelectCategory={(slug) => updateFilters({ categorySlug: slug })}
          />

          {/* Popover Filter Budget */}
          <BudgetFilterPopover
            minPrice={minPrice}
            maxPrice={maxPrice}
            isPending={isPending}
            onApply={(min, max) =>
              updateFilters({ minPrice: min, maxPrice: max })
            }
          />

          {/* Dummy Dropdown Buttons untuk UI Parity */}
          <Button
            variant="outline"
            className="rounded-xl border-border font-semibold text-sm h-10 px-4 hover:border-foreground transition-all gap-2"
          >
            Service options
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </div>
      </div>

      {/* BARIS 2: Active Filter Chips */}
      <ActiveFilterChips
        categorySlug={categorySlug}
        minPrice={minPrice}
        maxPrice={maxPrice}
        proServices={proServices}
        onRemove={removeFilterChip}
      />

      {/* BARIS 3: Results Count & Sort Dropdown */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <span className="font-semibold">
          {totalResults > 0
            ? `${totalResults.toLocaleString()}+ hasil`
            : "0 hasil"}
        </span>

        <SortBySelect
          value={sortBy}
          onChange={(val) => updateFilters({ sortBy: val })}
        />
      </div>
    </div>
  );
}
