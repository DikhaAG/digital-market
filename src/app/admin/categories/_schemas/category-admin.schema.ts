import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app";

/** Single source of truth untuk pembuatan Slug */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ============================================================================
// CENTRALIZED TRPC ROUTER TYPES
// ============================================================================
type RouterOutput = inferRouterOutputs<AppRouter>;

export type ParentCategoryItem =
  RouterOutput["admin"]["getCategoryTree"][number];
export type SubCategoryItem = ParentCategoryItem["subcategories"][number];
export type PackageFeatureItem = SubCategoryItem["packageFeatures"][number];
export type AttributeItem = SubCategoryItem["attributes"][number];
export type AttributeOptionItem = AttributeItem["options"][number];

// ============================================================================
// SCHEMAS
// ============================================================================
export const parentCategorySchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  icon: z.string().optional().nullable(),
  image: z
    .url({ message: "URL Gambar CDN tidak valid" })
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export const subCategorySchema = parentCategorySchema.extend({
  parentId: z.uuid({ message: "Parent Category ID tidak valid" }).optional(),
});

export const packageFeatureSchema = z.object({
  name: z.string().min(2, { message: "Nama fitur minimal 2 karakter" }),
  type: z.enum(["boolean", "text", "number"], {
    message: "Pilih tipe fitur yang valid",
  }),
});

export const attributeSchema = z.object({
  name: z.string().min(2, { message: "Nama atribut minimal 2 karakter" }),
});

export const attributeOptionSchema = z.object({
  label: z.string().min(1, { message: "Label opsi tidak boleh kosong" }),
  value: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.uuid({ message: "ID Kategori harus berupa UUID valid" }),
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  slug: z.string().min(2, { message: "Slug minimal 2 karakter" }),
  icon: z.string().optional().nullable(),
  image: z
    .url({ message: "URL Gambar CDN tidak valid" })
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ParentCategoryInput = z.infer<typeof parentCategorySchema>;
export type SubCategoryInput = z.infer<typeof subCategorySchema>;
export type PackageFeatureInput = z.infer<typeof packageFeatureSchema>;
export type AttributeInput = z.infer<typeof attributeSchema>;
export type AttributeOptionInput = z.infer<typeof attributeOptionSchema>;
