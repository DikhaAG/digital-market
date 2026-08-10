"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseAdminDialog } from "../base-admin-dialog";
import { CategoryFormFields } from "./category-form-fields";
import { useCategoryTreeMutation } from "../../_hooks/use-category-tree-mutation";
import {
  parentCategorySchema,
  slugify,
  type ParentCategoryInput,
} from "../../_schemas/category-admin.schema";

export function CreateParentCategoryDialog() {
  const form = useForm<ParentCategoryInput>({
    resolver: zodResolver(parentCategorySchema),
    defaultValues: { name: "", icon: "", image: "" },
  });

  const { trpc, createOptions } = useCategoryTreeMutation();
  const mutation = trpc.admin.createCategory.useMutation(
    createOptions({ successMessage: "Kategori utama berhasil dibuat" }),
  );

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
      onSubmit={(data) =>
        mutation.mutate({
          name: data.name,
          slug: slugify(data.name),
          icon: data.icon || null,
          image: data.image || null,
        })
      }
      isPending={mutation.isPending}
      submitText="Simpan Kategori Utama"
      maxWidth="md"
    >
      <CategoryFormFields form={form} isPending={mutation.isPending} />
    </BaseAdminDialog>
  );
}
