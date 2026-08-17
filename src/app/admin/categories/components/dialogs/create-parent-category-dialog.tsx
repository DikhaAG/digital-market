"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseAdminDialog } from "../base-admin-dialog";
import { CategoryFormFields } from "./category-form-fields";
import { useCategoryActions } from "../../_hooks/use-category-actions";
import {
  parentCategorySchema,
  type ParentCategoryInput,
} from "../../_schemas/category-admin.schema";

export function CreateParentCategoryDialog() {
  const form = useForm<ParentCategoryInput>({
    resolver: zodResolver(parentCategorySchema),
    defaultValues: { name: "", icon: "", image: "" },
  });

  const { handleCreateCategory, isMutatingCategory } = useCategoryActions();

  return (
    <BaseAdminDialog
      trigger={
        <Button className="font-semibold gap-2 rounded-xl shadow-xs transition-all hover:shadow-sm">
          <FolderPlus className="h-4 w-4" />
          <span>Tambah Kategori Utama</span>
        </Button>
      }
      title="Buat Kategori Utama (Parent)"
      description="Kategori utama menjadi pengelompokan tingkat atas di katalog marketplace."
      form={form}
      onSubmit={(data) => handleCreateCategory(data, () => form.reset())}
      isPending={isMutatingCategory}
      submitText="Simpan Kategori Utama"
      maxWidth="md"
    >
      <CategoryFormFields form={form} isPending={isMutatingCategory} />
    </BaseAdminDialog>
  );
}
