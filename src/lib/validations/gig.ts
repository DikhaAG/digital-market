import { z } from "zod";

export const packageFeatureValueSchema = z.object({
  packageFeatureId: z.uuid(),
  isIncluded: z.boolean().default(false),
  value: z.string().optional().nullable(),
});

export const gigPackageSchema = z.object({
  packageType: z.enum(["basic", "standard", "premium"]),
  title: z.string().min(2, "Judul paket minimal 2 karakter"),
  description: z.string().optional(),
  price: z.number().min(1, "Harga minimal $1"),
  deliveryTimeDays: z.number().min(1, "Waktu pengiriman minimal 1 hari"),
  revisions: z.number().min(0, "Jumlah revisi minimal 0"),
  featureValues: z.array(packageFeatureValueSchema),
});

export const gigFormSchema = z.object({
  id: z.uuid().optional(),
  sellerId: z.string().min(1, "Pilih Seller"),
  categoryId: z.uuid("Pilih Kategori yang valid"),
  title: z.string().min(5, "Judul Gig minimal 5 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  about: z.string().min(10, "Deskripsi minimal 10 karakter").optional(),
  coverImage: z.url("URL Gambar tidak valid").optional().or(z.literal("")),
  attributeOptionIds: z.array(z.uuid()).default([]),
  packages: z
    .array(gigPackageSchema)
    .min(1, "Minimal harus mengisi paket Basic"),
});

export type GigFormValues = z.infer<typeof gigFormSchema>;
