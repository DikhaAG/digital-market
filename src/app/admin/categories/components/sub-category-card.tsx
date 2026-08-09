"use client";

import { Layers, CheckSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { PackageFeaturesTab } from "./package-features-tab";
import { FilterAttributesTab } from "./filter-attributes-tab";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";

// Inferensi tipe data sub-kategori dari return value router tRPC 'admin.getCategoryTree'
type RouterOutput = inferRouterOutputs<AppRouter>;
export type SubCategoryItem =
  RouterOutput["admin"]["getCategoryTree"][number]["subcategories"][number];

interface SubCategoryCardProps {
  sub: SubCategoryItem;
}

export function SubCategoryCard({ sub }: SubCategoryCardProps) {
  const utils = trpc.useUtils();
  const deleteCategoryMutation = trpc.admin.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success("Sub-kategori berhasil dihapus");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

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

        <DeleteConfirmDialog
          title={`Hapus sub-kategori "${sub.name}"?`}
          description="Tindakan ini tidak dapat dibatalkan."
          onConfirm={() => deleteCategoryMutation.mutate({ id: sub.id })}
          isPending={deleteCategoryMutation.isPending}
        />
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
