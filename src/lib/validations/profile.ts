// src/lib/validations/profile.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  image: z
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
