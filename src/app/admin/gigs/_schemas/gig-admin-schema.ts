import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app";

export { gigFormSchema, type GigFormValues } from "@/lib/validations/gig";
export { slugify } from "@/app/admin/categories/_schemas/category-admin.schema";

// Centralized Type Inference dari tRPC Router
type RouterOutput = inferRouterOutputs<AppRouter>;

export type GigAuditItem =
  RouterOutput["admin"]["getGigsForAudit"]["items"][number];
export type SellerItem = RouterOutput["admin"]["getAllSellers"][number];

export const gigAuditFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sellerId: z.string().optional(),
  sortBy: z.enum(["createdAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export type GigAuditFilterInput = z.infer<typeof gigAuditFilterSchema>;
