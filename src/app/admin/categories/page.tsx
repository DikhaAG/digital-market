"use client";

import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { CreateParentCategoryDialog } from "./components/category-dialogs";
import { ParentCategoryCard } from "./components/parent-category-card";

export default function CategoryAdminPage() {
  const { data: categoryTree, isLoading } =
    trpc.admin.getCategoryTree.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Category Tree View */}
      <div className="space-y-6">
        {categoryTree?.map((parent) => (
          <ParentCategoryCard key={parent.id} parent={parent} />
        ))}
      </div>
    </div>
  );
}
