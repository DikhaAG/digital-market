// src/app/admin/categories/components/sub-category-card.tsx
"use client";

import { Layers, CheckSquare, Filter, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { EditCategoryDialog } from "./dialogs";
import { PackageFeaturesTab } from "./package-features-tab";
import { FilterAttributesTab } from "./filter-attributes-tab";
import { RelatedGigsTab } from "./related-gigs-tab"; // 👈 Import Komponen Baru
import { useCategoryTreeMutation } from "../_hooks/use-category-tree-mutation";
import { type SubCategoryItem } from "../_schemas/category-admin.schema";

interface SubCategoryCardProps {
  sub: SubCategoryItem;
}

export function SubCategoryCard({ sub }: SubCategoryCardProps) {
  const { trpc, createOptions } = useCategoryTreeMutation();
  const deleteMutation = trpc.admin.deleteCategory.useMutation(
    createOptions({ successMessage: "Sub-kategori berhasil dihapus" }),
  );

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-border/70 bg-card/60 space-y-4 shadow-2xs transition-colors hover:border-border">
      {/* Header Sub-kategori */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-extrabold text-sm sm:text-base text-foreground truncate max-w-[180px] sm:max-w-xs">
              {sub.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px] hidden xs:inline">
              ({sub.slug})
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold px-2 py-0.2 shrink-0"
            >
              {sub.gigCount ?? 0} Gigs
            </Badge>
          </div>
        </div>

        {/* Group Tombol Aksi */}
        <div className="flex items-center justify-end gap-1 shrink-0 self-end sm:self-auto">
          <EditCategoryDialog
            category={sub}
            title={`Edit Sub-kategori "${sub.name}"`}
          />
          <DeleteConfirmDialog
            title={`Hapus sub-kategori "${sub.name}"?`}
            description="Tindakan ini tidak dapat dibatalkan. Seluruh atribut filter dan fitur di dalamnya akan ikut terhapus."
            onConfirm={() => deleteMutation.mutate({ id: sub.id })}
            isPending={deleteMutation.isPending}
          />
        </div>
      </div>

      {/* Tabs Relasi Features, Attributes & Related Gigs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="bg-muted/70 w-full grid grid-cols-3 h-auto p-1 gap-1 rounded-lg">
          <TabsTrigger
            value="features"
            className="text-xs font-semibold gap-1.5 py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
          >
            <CheckSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              Features ({sub.packageFeatures.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="attributes"
            className="text-xs font-semibold gap-1.5 py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              Attributes ({sub.attributes.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="gigs"
            className="text-xs font-semibold gap-1.5 py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
          >
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">Gigs ({sub.gigCount ?? 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-3">
          <PackageFeaturesTab
            categoryId={sub.id}
            features={sub.packageFeatures}
          />
        </TabsContent>
        <TabsContent value="attributes" className="mt-3">
          <FilterAttributesTab
            categoryId={sub.id}
            attributes={sub.attributes}
          />
        </TabsContent>
        <TabsContent value="gigs" className="mt-3">
          <RelatedGigsTab categoryId={sub.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
