"use client";

import { Layers, CheckSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { EditCategoryDialog } from "./dialogs"; // 👈 Import EditCategoryDialog
import { PackageFeaturesTab } from "./package-features-tab";
import { FilterAttributesTab } from "./filter-attributes-tab";
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
    <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-background space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-extrabold text-sm sm:text-base text-foreground">
            {sub.name}
          </span>
          <span className="text-xs text-muted-foreground">({sub.slug})</span>
          <Badge variant="secondary" className="text-[10px]">
            {sub.gigs.length} Gigs
          </Badge>
        </div>

        {/* Action Group Header */}
        <div className="flex items-center gap-1">
          <EditCategoryDialog
            category={sub}
            title={`Edit Sub-kategori "${sub.name}"`}
          />
          <DeleteConfirmDialog
            title={`Hapus sub-kategori "${sub.name}"?`}
            description="Tindakan ini tidak dapat dibatalkan."
            onConfirm={() => deleteMutation.mutate({ id: sub.id })}
            isPending={deleteMutation.isPending}
          />
        </div>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="bg-muted/60 h-9 p-1">
          <TabsTrigger
            value="features"
            className="text-xs font-semibold gap-1.5"
          >
            <CheckSquare className="h-3.5 w-3.5" /> Package Features (
            {sub.packageFeatures.length})
          </TabsTrigger>
          <TabsTrigger
            value="attributes"
            className="text-xs font-semibold gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" /> Filter Attributes (
            {sub.attributes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <PackageFeaturesTab
            categoryId={sub.id}
            features={sub.packageFeatures}
          />
        </TabsContent>
        <TabsContent value="attributes">
          <FilterAttributesTab
            categoryId={sub.id}
            attributes={sub.attributes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
