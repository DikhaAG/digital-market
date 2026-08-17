"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function useSearchFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "relevance";
  const proServices = searchParams.get("pro") === "true";
  const categorySlug = searchParams.get("categorySlug") ?? "";

  // Ambil array of attribute option IDs dari URL (misal: ?options=opt1,opt2)
  const rawOptions = searchParams.get("options") ?? "";
  const selectedOptionIds = rawOptions
    ? rawOptions.split(",").filter(Boolean)
    : [];

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      params.set("page", "1");
      return params.toString();
    },
    [searchParams],
  );

  const updateFilters = (paramsToUpdate: Record<string, string | null>) => {
    const queryString = createQueryString(paramsToUpdate);
    startTransition(() => {
      router.push(`${pathname}?${queryString}`);
    });
  };

  const removeFilterChip = (key: string, valueToRemove?: string) => {
    if (key === "budget") {
      updateFilters({ minPrice: null, maxPrice: null });
    } else if (key === "pro") {
      updateFilters({ pro: null });
    } else if (key === "category") {
      // Hapus kategori sekaligus opsi atribut yang terikat dengannya
      updateFilters({ categorySlug: null, options: null });
    } else if (key === "option" && valueToRemove) {
      const nextOptions = selectedOptionIds.filter(
        (id) => id !== valueToRemove,
      );
      updateFilters({
        options: nextOptions.length > 0 ? nextOptions.join(",") : null,
      });
    } else {
      updateFilters({ [key]: null });
    }
  };

  return {
    categorySlug,
    minPrice,
    maxPrice,
    sortBy,
    proServices,
    selectedOptionIds,
    isPending,
    updateFilters,
    removeFilterChip,
  };
}
