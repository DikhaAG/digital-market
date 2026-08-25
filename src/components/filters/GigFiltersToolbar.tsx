// src/components/filters/GigFiltersToolbar.tsx
"use client";

import { CategoryFilterPopover } from "./CategoryFilterPopover";
import { BudgetFilterPopover } from "./BudgetFilterPopover";
import { ServiceOptionsFilterPopover } from "./ServiceOptionsFilterPopover";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { SortBySelect } from "./SortBySelect";
import { useFilterParams } from "./hooks/useFilterParams";

export interface GigFiltersToolbarProps {
  totalResults: number;
  fixedCategorySlug?: string;
  initialCategoryName?: string;
  variant?: "search" | "category" | "subcategory";
  showCategoryChip?: boolean;
}

export function GigFiltersToolbar({
  totalResults,
  fixedCategorySlug,
  initialCategoryName,
  variant = "search",
  showCategoryChip = true,
}: GigFiltersToolbarProps) {
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
  } = useFilterParams({ fixedCategorySlug });

  // Disembunyikan secara kontekstual jika sudah berada di hirarki sub-kategori
  const shouldHideCategoryFilter = variant === "subcategory";

  return (
    <div className="space-y-4">
      {/* BARIS 1: Context-Aware Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!shouldHideCategoryFilter && (
            <CategoryFilterPopover
              selectedCategorySlug={categorySlug}
              initialCategoryName={initialCategoryName}
              isPending={isPending}
              onSelectCategory={(slug) => updateFilters({ categorySlug: slug })}
            />
          )}

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
        showCategoryChip={showCategoryChip && variant === "search"}
        onRemove={removeFilterChip}
      />

      {/* BARIS 3: Results Counter & Sorting Mechanism */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <span className="font-semibold">
          {totalResults > 0
            ? `${totalResults.toLocaleString()} layanan ditemukan`
            : "0 layanan ditemukan"}
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
