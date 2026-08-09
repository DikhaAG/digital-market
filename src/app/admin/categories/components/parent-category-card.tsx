"use client";

import { Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { CreateSubCategoryDialog } from "./category-dialogs";
import { SubCategoryCard } from "./sub-category-card";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";

// Infeferensi tipe otomatis dari output router tRPC 'admin.getCategoryTree'
type RouterOutput = inferRouterOutputs<AppRouter>;
export type ParentCategoryItem =
  RouterOutput["admin"]["getCategoryTree"][number];

interface ParentCategoryCardProps {
  parent: ParentCategoryItem;
}

export function ParentCategoryCard({ parent }: ParentCategoryCardProps) {
  const utils = trpc.useUtils();
  const deleteCategoryMutation = trpc.admin.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success("Kategori utama berhasil dihapus");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

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
              <Badge variant="outline" className="text-xs">
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
            onConfirm={() => deleteCategoryMutation.mutate({ id: parent.id })}
            isPending={deleteCategoryMutation.isPending}
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
