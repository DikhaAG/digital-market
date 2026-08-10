"use client";

import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateParentCategoryDialog } from "./components/dialogs";
import { ParentCategoryCard } from "./components/parent-category-card";

export default function CategoryAdminPage() {
  const { data: categoryTree, isLoading } = trpc.admin.getCategoryTree.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 5, // 👈 Cache data selama 5 menit
      refetchOnWindowFocus: false, // 👈 Cegah query ulang otomatis saat klik tab browser
    },
  );
  return (
    <div className="space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Categories & Relational Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola hirarki kategori, filter kustom atribut, serta checklist
            fitur paket komparasi.
          </p>
        </div>
        <CreateParentCategoryDialog />
      </div>

      {/* Category Tree View / Skeleton State */}
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/60 rounded-2xl p-5 space-y-4 bg-card"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))
        ) : categoryTree && categoryTree.length > 0 ? (
          categoryTree.map((parent) => (
            <ParentCategoryCard key={parent.id} parent={parent} />
          ))
        ) : (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/20 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Belum ada kategori utama.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Klik tombol di atas untuk membuat kategori baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
