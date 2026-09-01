// src/app/admin/categories/components/parent-category-card.tsx
"use client";

import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { CreateSubCategoryDialog, EditCategoryDialog } from "./dialogs";
import { SubCategoryCard } from "./sub-category-card";
import { type ParentCategoryItem } from "../_schemas/category-admin.schema";
import { useCategoryActions } from "../_hooks/use-category-actions";
import { DynamicLucideIcon } from "@/components/CategoryIcon";

interface ParentCategoryCardProps {
  parent: ParentCategoryItem;
}

export const ParentCategoryCard = memo(function ParentCategoryCard({
  parent,
}: ParentCategoryCardProps) {
  const { deleteCategory, isDeletingCategory } = useCategoryActions();

  return (
    <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-2xs transition-all hover:border-border">
      {/* Header Utama Kategori Induk */}
      <div className="p-3.5 sm:p-5 bg-muted/30 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <DynamicLucideIcon name={parent.icon} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3 className="font-black text-foreground text-base sm:text-lg truncate max-w-50 sm:max-w-md">
                {parent.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[11px] font-mono shrink-0 px-2 bg-background/50"
              >
                {parent.slug}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {parent.subcategories.length} Sub-kategori terdaftar
            </p>
          </div>
        </div>

        {/* Group Tombol Aksi Header */}
        <div className="flex items-center gap-1.5 shrink-0 justify-end">
          <CreateSubCategoryDialog
            parentId={parent.id}
            parentName={parent.name}
          />
          <EditCategoryDialog
            category={parent}
            title={`Edit Kategori Utama "${parent.name}"`}
          />
          <DeleteConfirmDialog
            title={`Hapus kategori "${parent.name}"?`}
            description="Seluruh sub-kategori, atribut filter, dan fitur paket di dalamnya akan ikut terhapus secara permanen."
            onConfirm={() => deleteCategory({ id: parent.id })}
            isPending={isDeletingCategory}
          />
        </div>
      </div>

      {/* Konten Sub-kategori */}
      <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5">
        {parent.subcategories.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border/60 rounded-xl bg-muted/10 space-y-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground italic">
              Belum ada sub-kategori di bawah {parent.name}.
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Klik tombol &quot;+ Sub-kategori&quot; di atas untuk mengelolanya.
            </p>
          </div>
        ) : (
          parent.subcategories.map((sub) => (
            <SubCategoryCard key={sub.id} sub={sub} />
          ))
        )}
      </div>
    </div>
  );
});
