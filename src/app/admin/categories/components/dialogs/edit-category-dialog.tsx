// src/app/admin/categories/components/dialogs/edit-category-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseAdminDialog } from "../base-admin-dialog";
import { CategoryFormFields } from "./category-form-fields";
import { useCategoryActions } from "../../_hooks/use-category-actions";
import {
  parentCategorySchema,
  type ParentCategoryInput,
} from "../../_schemas/category-admin.schema";

interface EditCategoryDialogProps {
  category: {
    id: string;
    name: string;
    icon?: string | null;
    image?: string | null;
  };
  title?: string;
  description?: string;
}

export function EditCategoryDialog({
  category,
  title = "Edit Kategori",
  description = "Ubah rincian informasi kategori di bawah ini.",
}: EditCategoryDialogProps) {
  const form = useForm<ParentCategoryInput>({
    resolver: zodResolver(parentCategorySchema),
    values: {
      name: category.name,
      icon: category.icon ?? "",
      image: category.image ?? "",
    },
  });

  const { handleUpdateCategory, isMutatingCategory } = useCategoryActions();

  return (
    <BaseAdminDialog
      trigger={
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Edit ${category.name}`}
          title={`Edit ${category.name}`}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors shrink-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      }
      title={title}
      description={description}
      form={form}
      onSubmit={(data) =>
        handleUpdateCategory({ id: category.id, ...data }, () => form.reset())
      }
      isPending={isMutatingCategory}
      submitText="Simpan Perubahan"
      maxWidth="md"
    >
      <CategoryFormFields form={form} isPending={isMutatingCategory} />
    </BaseAdminDialog>
  );
}
