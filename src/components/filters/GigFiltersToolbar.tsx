"use client";

import { CategoryFilterPopover } from "./CategoryFilterPopover";
import { BudgetFilterPopover } from "./BudgetFilterPopover";
import { ServiceOptionsFilterPopover } from "./ServiceOptionsFilterPopover";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { SortBySelect } from "./SortBySelect";
import { useFilterParams } from "./hooks/useFilterParams";

export interface GigFiltersToolbarProps {
  /** Total hasil pencarian dari server */
  totalResults: number;
  /** Slug kategori terkunci jika berada di halaman kategori /categories/[category] */
  fixedCategorySlug?: string;
  /** Apakah dropdown filter kategori disembunyikan */
  hideCategoryFilter?: boolean;
  /** Apakah chip filter kategori ditampilkan di baris active chips */
  showCategoryChip?: boolean;
}

export function GigFiltersToolbar({
  totalResults,
  fixedCategorySlug,
  hideCategoryFilter = false,
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

  return (
    <div className="space-y-4">
      {/* BARIS 1: Dropdown Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Popover Filter Kategori (opsional disembunyikan di halaman spesifik) */}
          {!hideCategoryFilter && (
            <CategoryFilterPopover
              selectedCategorySlug={categorySlug}
              isPending={isPending}
              onSelectCategory={(slug) => updateFilters({ categorySlug: slug })}
            />
          )}

          {/* Popover Filter Budget */}
          <BudgetFilterPopover
            minPrice={minPrice}
            maxPrice={maxPrice}
            isPending={isPending}
            onApply={(min, max) =>
              updateFilters({ minPrice: min, maxPrice: max })
            }
          />

          {/* Popover Filter Opsi Layanan Dinamis */}
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
        showCategoryChip={showCategoryChip}
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
