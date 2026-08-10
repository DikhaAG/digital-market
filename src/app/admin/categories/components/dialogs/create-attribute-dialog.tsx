"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BaseAdminDialog } from "../base-admin-dialog";
import {
  attributeSchema,
  slugify,
  type AttributeInput,
} from "../../_schemas/category-admin.schema";

interface CreateAttributeDialogProps {
  categoryId: string;
}

export function CreateAttributeDialog({
  categoryId,
}: CreateAttributeDialogProps) {
  const utils = trpc.useUtils();
  const form = useForm<AttributeInput>({
    resolver: zodResolver(attributeSchema),
    defaultValues: { name: "" },
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const liveSlug = watchedName ? slugify(watchedName) : "";

  const mutation = trpc.admin.createAttribute.useMutation({
    onSuccess: () => {
      toast.success("Atribut kategori berhasil ditambahkan");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal menambah atribut"),
  });

  return (
    <BaseAdminDialog
      trigger={
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 font-medium"
        >
          <ListPlus className="h-3.5 w-3.5 text-primary" />
          <span>Tambah Atribut</span>
        </Button>
      }
      title="Tambah Atribut Kategori"
      form={form}
      onSubmit={(data) =>
        mutation.mutate({
          categoryId,
          name: data.name,
          slug: slugify(data.name),
        })
      }
      isPending={mutation.isPending}
      submitText="Simpan Atribut"
      submitIcon={null}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Nama Atribut
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Programming Language, Style"
                {...field}
              />
            </FormControl>
            {liveSlug && (
              <div className="text-[11px] font-mono text-muted-foreground">
                slug: {liveSlug}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </BaseAdminDialog>
  );
}
