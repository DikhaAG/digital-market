// src/app/admin/categories/_hooks/use-category-actions.ts
"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

/**
 * Unified Command Hook untuk seluruh operasi mutasi Kategori, Atribut, Opsi, dan Fitur Paket
 */
export function useCategoryActions() {
  const utils = trpc.useUtils();

  // Unified Cache Invalidation
  const invalidateTree = () => utils.admin.getCategoryTree.invalidate();

  // Mutations Setup
  const createAttributeMutation = trpc.admin.createAttribute.useMutation({
    onSuccess: () => {
      toast.success("Atribut filter berhasil ditambahkan");
      invalidateTree();
    },
    onError: (err) => toast.error(err.message || "Gagal menambah atribut"),
  });

  const deleteAttributeMutation = trpc.admin.deleteAttribute.useMutation({
    onSuccess: () => {
      toast.success("Atribut berhasil dihapus");
      invalidateTree();
    },
    onError: (err) => toast.error(err.message || "Gagal menghapus atribut"),
  });

  const createAttributeOptionMutation =
    trpc.admin.createAttributeOption.useMutation({
      onSuccess: () => {
        toast.success("Opsi atribut ditambahkan");
        invalidateTree();
      },
      onError: (err) => toast.error(err.message || "Gagal menambah opsi"),
    });

  const deleteAttributeOptionMutation =
    trpc.admin.deleteAttributeOption.useMutation({
      onSuccess: () => {
        toast.success("Opsi atribut dihapus");
        invalidateTree();
      },
      onError: (err) => toast.error(err.message || "Gagal menghapus opsi"),
    });

  const addPackageFeatureMutation = trpc.admin.addPackageFeature.useMutation({
    onSuccess: () => {
      toast.success("Fitur paket ditambahkan");
      invalidateTree();
    },
    onError: (err) => toast.error(err.message || "Gagal menambah fitur"),
  });

  const deletePackageFeatureMutation =
    trpc.admin.deletePackageFeature.useMutation({
      onSuccess: () => {
        toast.success("Fitur paket dihapus");
        invalidateTree();
      },
      onError: (err) => toast.error(err.message || "Gagal menghapus fitur"),
    });

  return {
    createAttribute: createAttributeMutation.mutate,
    isCreatingAttribute: createAttributeMutation.isPending,

    deleteAttribute: deleteAttributeMutation.mutate,
    isDeletingAttribute: deleteAttributeMutation.isPending,
    deletingAttributeId: deleteAttributeMutation.variables?.id,

    createAttributeOption: createAttributeOptionMutation.mutate,
    isCreatingAttributeOption: createAttributeOptionMutation.isPending,

    deleteAttributeOption: deleteAttributeOptionMutation.mutate,
    isDeletingAttributeOption: deleteAttributeOptionMutation.isPending,
    deletingOptionId: deleteAttributeOptionMutation.variables?.id,

    addPackageFeature: addPackageFeatureMutation.mutate,
    isAddingPackageFeature: addPackageFeatureMutation.isPending,

    deletePackageFeature: deletePackageFeatureMutation.mutate,
    isDeletingPackageFeature: deletePackageFeatureMutation.isPending,
    deletingFeatureId: deletePackageFeatureMutation.variables?.id,
  };
}
