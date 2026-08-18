"use client";

import { useSearchFilterParams } from "./hooks/useSearchFilterParams";
import { CategoryFilterPopover } from "./CategoryFilterPopover";
import { BudgetFilterPopover } from "./BudgetFilterPopover";
import { ServiceOptionsFilterPopover } from "./ServiceOptionsFilterPopover";
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
    selectedOptionIds,
    isPending,
    updateFilters,
    removeFilterChip,
  } = useSearchFilterParams();

  return (
    <div className="space-y-4">
      {/* BARIS 1: Dropdown Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <CategoryFilterPopover
            selectedCategorySlug={categorySlug}
            isPending={isPending}
            onSelectCategory={(slug) => updateFilters({ categorySlug: slug })}
          />

          <BudgetFilterPopover
            minPrice={minPrice}
            maxPrice={maxPrice}
            isPending={isPending}
            onApply={(min, max) =>
              updateFilters({ minPrice: min, maxPrice: max })
            }
          />

          <ServiceOptionsFilterPopover
            categorySlug={categorySlug}
            selectedOptionIds={selectedOptionIds}
            isPending={isPending}
            onApply={(optionIds) =>
              updateFilters({
                options: optionIds.length > 0 ? optionIds.join(",") : null,
              })
            }
          />
        </div>
      </div>

      {/* BARIS 2: Active Filter Chips */}
      <ActiveFilterChips
        categorySlug={categorySlug}
        minPrice={minPrice}
        maxPrice={maxPrice}
        proServices={proServices}
        selectedOptionIds={selectedOptionIds}
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
          disabled={isPending}
          onChange={(val) => updateFilters({ sortBy: val })}
        />
      </div>
    </div>
  );
}
