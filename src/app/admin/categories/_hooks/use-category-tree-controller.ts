// src/app/admin/categories/_hooks/use-category-tree-controller.ts
"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";

/**
 * Custom Hook Facade untuk mengisolasi logika query dan perhitungan statistik pohon kategori
 */
export function useCategoryTreeController() {
  const {
    data: categoryTree,
    isLoading,
    isRefetching,
  } = trpc.admin.getCategoryTree.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchOnWindowFocus: false, // Prevent refetch otomatis saat switch tab[cite: 20]
  });

  // Perhitungan statistik pohon kategori (Memoized)
  const stats = useMemo(() => {
    if (!categoryTree) return { totalParents: 0, totalSubs: 0, totalGigs: 0 };

    const totalParents = categoryTree.length;
    let totalSubs = 0;
    let totalGigs = 0;

    for (const parent of categoryTree) {
      totalSubs += parent.subcategories.length;
      for (const sub of parent.subcategories) {
        totalGigs += sub.gigCount ?? 0;
      }
    }

    return { totalParents, totalSubs, totalGigs };
  }, [categoryTree]);

  return {
    categoryTree: categoryTree ?? [],
    isLoading,
    isRefetching,
    stats,
  };
}
