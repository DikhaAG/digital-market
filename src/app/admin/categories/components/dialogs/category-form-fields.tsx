// src/app/admin/categories/components/dialogs/category-form-fields.tsx
"use client";

import React, { useMemo } from "react";
import {
  useWatch,
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import {
  Link2,
  Folder,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ui/image-uploader";
import { slugify } from "../../_schemas/category-admin.schema";

interface CategoryFormFieldsProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  isPending: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
}

/**
  Helper Komponen: Resolver Icon Lucide secara dinamis dengan nama string (kebab-case / PascalCase)
 */
function DynamicLucideIcon({
  name,
  className = "h-5 w-5",
  fallback: FallbackIcon = Folder,
}: {
  name?: string | null;
  className?: string;
  fallback?: React.ComponentType<{ className?: string }>;
}) {
  const IconComponent = useMemo(() => {
    if (!name || !name.trim()) return null;

    const trimmed = name.trim();
    // 1. Coba pencarian langsung
    if (LucideIcons[trimmed as keyof typeof LucideIcons]) {
      return LucideIcons[
        trimmed as keyof typeof LucideIcons
      ] as React.ComponentType<{ className?: string }>;
    }

    // 2. Format dari kebab-case (misal: "shopping-bag") ke PascalCase ("ShoppingBag")
    const pascalName = trimmed
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");

    if (LucideIcons[pascalName as keyof typeof LucideIcons]) {
      return LucideIcons[
        pascalName as keyof typeof LucideIcons
      ] as React.ComponentType<{ className?: string }>;
    }

    return null;
  }, [name]);

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return <FallbackIcon className={className} />;
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

  const watchedIcon = useWatch({
    control: form.control,
    name: "icon" as Path<TFieldValues>,
  });

  const watchedImage = useWatch({
    control: form.control,
    name: "image" as Path<TFieldValues>,
  });

  const liveSlug = watchedName ? slugify(String(watchedName)) : "";
  const currentTab = watchedImage ? "image" : "icon";

  return (
    <div className="space-y-5">
      {/* Visual Live Preview Header */}
      <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-muted/60 via-muted/30 to-transparent rounded-xl border border-border/60">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-background shadow-xs">
          {watchedImage ? (
            <Image
              src={watchedImage}
              alt="Category Visual Preview"
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <DynamicLucideIcon
              name={watchedIcon}
              className="h-6 w-6 text-primary"
              fallback={Folder}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm truncate">
              {watchedName || "Nama Kategori Baru"}
            </h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Live Preview
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {watchedImage
              ? "Menggunakan Cloudinary CDN Image"
              : watchedIcon
                ? `Menggunakan Icon Lucide: "${watchedIcon}"`
                : "Menggunakan Default Icon (Folder)"}
          </p>
        </div>
      </div>

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
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                <Link2 className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">slug: {liveSlug}</span>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Visual Tab Selector for Icon vs Image */}
      <div className="space-y-3 pt-1">
        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
          Aset Visual Kategori (Icon / Gambar)
        </FormLabel>

        <Tabs defaultValue={currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="icon"
              className="text-xs font-medium rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <LucideIcons.Smile className="h-3.5 w-3.5" />
              <span>Lucide Icon</span>
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="text-xs font-medium rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Cloudinary Image</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Nama Icon Lucide */}
          <TabsContent value="icon" className="pt-3 space-y-3">
            <FormField
              control={form.control}
              name={"icon" as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="Contoh: code, palette, terminal, cpu, layers..."
                        disabled={isPending}
                        {...field}
                        value={field.value ?? ""}
                        className="pr-10"
                      />
                      <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
                        <DynamicLucideIcon
                          name={field.value}
                          className="h-4 w-4 text-primary"
                          fallback={HelpCircle}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Ketik nama icon dari koleksi Lucide React (misal:{" "}
                    <code>laptop</code>, <code>code-2</code>, <code>store</code>
                    ).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Tab 2: Cloudinary Image Uploader */}
          <TabsContent value="image" className="pt-3 space-y-3">
            <FormField
              control={form.control}
              name={"image" as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value ?? ""}
                      onChange={(url) => field.onChange(url || "")}
                      folder="marketplace/categories"
                      disabled={isPending}
                      aspectRatio="square"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Unggah icon/banner khusus berformat PNG, WebP, atau SVG ke
                    Cloudinary CDN.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
