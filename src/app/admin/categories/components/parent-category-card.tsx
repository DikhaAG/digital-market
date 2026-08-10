"use client";

import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { CreateSubCategoryDialog } from "./dialogs";
import { SubCategoryCard } from "./sub-category-card";
import { useCategoryTreeMutation } from "../_hooks/use-category-tree-mutation";
import { type ParentCategoryItem } from "../_schemas/category-admin.schema";

interface ParentCategoryCardProps {
  parent: ParentCategoryItem;
}

export function ParentCategoryCard({ parent }: ParentCategoryCardProps) {
  const { trpc, createOptions } = useCategoryTreeMutation();
  const deleteMutation = trpc.admin.deleteCategory.useMutation(
    createOptions({ successMessage: "Kategori utama berhasil dihapus" }),
  );

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-foreground text-base sm:text-lg">
                {parent.name}
              </h3>
              <Badge variant="outline" className="text-xs font-mono">
                {parent.slug}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {parent.subcategories.length} Sub-kategori
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CreateSubCategoryDialog
            parentId={parent.id}
            parentName={parent.name}
          />
          <DeleteConfirmDialog
            title={`Hapus kategori "${parent.name}"?`}
            description="Seluruh sub-kategori, atribut filter, dan fitur di dalamnya akan ikut terhapus secara permanen."
            onConfirm={() => deleteMutation.mutate({ id: parent.id })}
            isPending={deleteMutation.isPending}
          />
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        {parent.subcategories.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            Belum ada sub-kategori di bawah {parent.name}.
          </p>
        ) : (
          parent.subcategories.map((sub) => (
            <SubCategoryCard key={sub.id} sub={sub} />
          ))
        )}
      </div>
    </div>
  );
}
