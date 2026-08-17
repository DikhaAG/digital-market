"use client";

import { useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { slugify } from "../_schemas/category-admin.schema";

interface MutationOptions {
  loadingMessage?: string;
  successMessage: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export function useCategoryActions() {
  const utils = trpc.useUtils();
  const toastIdRef = useRef<string | number | null>(null);

  const invalidateTree = useCallback(() => {
    return utils.admin.getCategoryTree.invalidate();
  }, [utils]);

  const createOptions = useCallback(
    ({
      loadingMessage,
      successMessage,
      errorMessage = "Terjadi kesalahan",
      onSuccess,
    }: MutationOptions) => ({
      onMutate: () => {
        if (loadingMessage) {
          toastIdRef.current = toast.loading(loadingMessage);
        }
      },
      onSuccess: () => {
        if (toastIdRef.current) {
          toast.success(successMessage, { id: toastIdRef.current });
          toastIdRef.current = null;
        } else {
          toast.success(successMessage);
        }
        invalidateTree();
        onSuccess?.();
      },
      onError: (err: { message?: string }) => {
        const message = err.message || errorMessage;
        if (toastIdRef.current) {
          toast.error(message, { id: toastIdRef.current });
          toastIdRef.current = null;
        } else {
          toast.error(message);
        }
      },
    }),
    [invalidateTree],
  );

  const createCategory = trpc.admin.createCategory.useMutation(
    createOptions({ successMessage: "Kategori berhasil dibuat" }),
  );
  const updateCategory = trpc.admin.updateCategory.useMutation(
    createOptions({
      loadingMessage: "Memperbarui kategori...",
      successMessage: "Kategori berhasil diperbarui",
    }),
  );
  const deleteCategory = trpc.admin.deleteCategory.useMutation(
    createOptions({ successMessage: "Kategori berhasil dihapus" }),
  );

  const createAttribute = trpc.admin.createAttribute.useMutation(
    createOptions({ successMessage: "Atribut berhasil ditambahkan" }),
  );
  const deleteAttribute = trpc.admin.deleteAttribute.useMutation(
    createOptions({ successMessage: "Atribut berhasil dihapus" }),
  );

  const createAttributeOption = trpc.admin.createAttributeOption.useMutation(
    createOptions({ successMessage: "Opsi atribut berhasil ditambahkan" }),
  );
  const deleteAttributeOption = trpc.admin.deleteAttributeOption.useMutation(
    createOptions({ successMessage: "Opsi atribut berhasil dihapus" }),
  );

  const addPackageFeature = trpc.admin.addPackageFeature.useMutation(
    createOptions({ successMessage: "Fitur paket berhasil ditambahkan" }),
  );
  const deletePackageFeature = trpc.admin.deletePackageFeature.useMutation(
    createOptions({ successMessage: "Fitur paket berhasil dihapus" }),
  );

  return {
    // Category Wrappers dengan Enkapsulasi Slug
    handleCreateCategory: (
      data: {
        name: string;
        parentId?: string | null;
        icon?: string | null;
        image?: string | null;
      },
      onSuccess?: () => void,
    ) => {
      createCategory.mutate(
        {
          name: data.name,
          slug: slugify(data.name),
          parentId: data.parentId || null,
          icon: data.icon || null,
          image: data.image || null,
        },
        { onSuccess },
      );
    },

    handleUpdateCategory: (
      data: {
        id: string;
        name: string;
        icon?: string | null;
        image?: string | null;
      },
      onSuccess?: () => void,
    ) => {
      const generatedSlug = slugify(data.name);
      updateCategory.mutate(
        {
          id: data.id,
          name: data.name,
          slug:
            generatedSlug.length >= 2 ? generatedSlug : `${generatedSlug}-cat`,
          icon: data.icon || null,
          image: data.image || null,
        },
        { onSuccess },
      );
    },

    deleteCategory: deleteCategory.mutate,
    isDeletingCategory: deleteCategory.isPending,
    isMutatingCategory: createCategory.isPending || updateCategory.isPending,

    // Attribute Actions
    handleCreateAttribute: (
      categoryId: string,
      name: string,
      onSuccess?: () => void,
    ) => {
      createAttribute.mutate(
        { categoryId, name, slug: slugify(name) },
        { onSuccess },
      );
    },
    deleteAttribute: deleteAttribute.mutate,
    isDeletingAttribute: deleteAttribute.isPending,
    deletingAttributeId: deleteAttribute.variables?.id,
    isCreatingAttribute: createAttribute.isPending,

    // Attribute Option Actions
    handleCreateAttributeOption: (
      attributeId: string,
      label: string,
      value?: string,
      onSuccess?: () => void,
    ) => {
      createAttributeOption.mutate(
        { attributeId, label, value: value || slugify(label) },
        { onSuccess },
      );
    },
    deleteAttributeOption: deleteAttributeOption.mutate,
    isDeletingAttributeOption: deleteAttributeOption.isPending,
    deletingOptionId: deleteAttributeOption.variables?.id,
    isCreatingAttributeOption: createAttributeOption.isPending,

    // Package Feature Actions
    addPackageFeature: addPackageFeature.mutate,
    deletePackageFeature: deletePackageFeature.mutate,
    isAddingPackageFeature: addPackageFeature.isPending,
    isDeletingPackageFeature: deletePackageFeature.isPending,
    deletingFeatureId: deletePackageFeature.variables?.id,
  };
}
