// src/app/admin/categories/components/dialogs/category-form-fields.tsx
"use client";

import {
  useWatch,
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { slugify } from "../../_schemas/category-admin.schema";

interface CategoryFormFieldsProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  isPending: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
}

export function CategoryFormFields<TFieldValues extends FieldValues>({
  form,
  isPending,
  nameLabel = "Nama Kategori",
  namePlaceholder = "Contoh: Programming & Tech",
}: CategoryFormFieldsProps<TFieldValues>) {
  const watchedName = useWatch({
    control: form.control,
    name: "name" as Path<TFieldValues>,
  });
  const liveSlug = watchedName ? slugify(String(watchedName)) : "";

  return (
    <div className="space-y-4">
      {/* Field: Nama Kategori */}
      <FormField
        control={form.control}
        name={"name" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              {nameLabel}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={namePlaceholder}
                disabled={isPending}
                {...field}
              />
            </FormControl>
            {liveSlug && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                <Link2 className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">slug: {liveSlug}</span>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Field: Nama Icon Lucide */}
      <FormField
        control={form.control}
        name={"icon" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Nama Icon Lucide (Opsional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="code, palette, terminal..."
                disabled={isPending}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Field: Gambar Banner CDN (Cloudinary Direct Uploader) */}
      <FormField
        control={form.control}
        name={"image" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Banner Gambar CDN
            </FormLabel>
            <FormControl>
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                folder="marketplace/categories"
                disabled={isPending}
                aspectRatio="banner"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
