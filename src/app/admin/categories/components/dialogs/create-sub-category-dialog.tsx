"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { BaseAdminDialog } from "../base-admin-dialog";
import { CategoryFormFields } from "./category-form-fields";
import {
  subCategorySchema,
  slugify,
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
  const utils = trpc.useUtils();
  const form = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: { name: "", icon: "", image: "" },
  });

  const mutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Sub-kategori berhasil dibuat");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal membuat sub-kategori"),
  });

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
        mutation.mutate({
          name: data.name,
          slug: slugify(data.name),
          parentId,
          icon: data.icon || null,
          image: data.image || null,
        })
      }
      isPending={mutation.isPending}
      submitText="Simpan Sub-kategori"
      submitIcon={null}
      maxWidth="md"
    >
      <CategoryFormFields
        form={form}
        isPending={mutation.isPending}
        nameLabel="Nama Sub-Kategori"
        namePlaceholder="Contoh: Web Development"
      />
    </BaseAdminDialog>
  );
}
