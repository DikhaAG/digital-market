import { z } from "zod";

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const parentCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  icon: z.string().optional(),
});

export const subCategorySchema = z.object({
  name: z.string().min(2, "Nama sub-kategori minimal 2 karakter"),
});

export const packageFeatureSchema = z.object({
  name: z.string().min(2, "Nama fitur minimal 2 karakter"),
  type: z.enum(["boolean", "text", "number"]),
});

export const attributeSchema = z.object({
  name: z.string().min(2, "Nama atribut minimal 2 karakter"),
});

export const attributeOptionSchema = z.object({
  label: z.string().min(1, "Label tidak boleh kosong"),
});

export type ParentCategoryInput = z.infer<typeof parentCategorySchema>;
export type SubCategoryInput = z.infer<typeof subCategorySchema>;
export type PackageFeatureInput = z.infer<typeof packageFeatureSchema>;
export type AttributeInput = z.infer<typeof attributeSchema>;
export type AttributeOptionInput = z.infer<typeof attributeOptionSchema>;
