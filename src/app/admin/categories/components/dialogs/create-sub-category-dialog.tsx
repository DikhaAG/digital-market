"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseAdminDialog } from "../base-admin-dialog";
import { CategoryFormFields } from "./category-form-fields";
import { useCategoryActions } from "../../_hooks/use-category-actions";
import {
  subCategorySchema,
  type SubCategoryInput,
} from "../../_schemas/category-admin.schema";

interface CreateSubCategoryDialogProps {
  parentId: string;
  parentName: string;
}

export function CreateSubCategoryDialog({
  parentId,
  parentName,
}: CreateSubCategoryDialogProps) {
  const form = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: { name: "", icon: "", image: "" },
  });

  const { handleCreateCategory, isMutatingCategory } = useCategoryActions();

  return (
    <BaseAdminDialog
      trigger={
        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs font-semibold gap-1.5 rounded-lg border border-border/50 hover:bg-accent shrink-0 px-2.5 sm:px-3"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>
            Sub-kategori <span className="hidden sm:inline">Baru</span>
          </span>
        </Button>
      }
      title="Tambah Sub-kategori"
      description={`Menambahkan sub-kategori baru di bawah induk "${parentName}".`}
      form={form}
      onSubmit={(data) =>
        handleCreateCategory({ ...data, parentId }, () => form.reset())
      }
      isPending={isMutatingCategory}
      submitText="Simpan Sub-kategori"
      submitIcon={null}
      maxWidth="md"
    >
      <CategoryFormFields
        form={form}
        isPending={isMutatingCategory}
        nameLabel="Nama Sub-Kategori"
        namePlaceholder="Contoh: Web Development"
      />
    </BaseAdminDialog>
  );
}
