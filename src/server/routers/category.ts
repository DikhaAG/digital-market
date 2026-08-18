//src/lib/trpc/routers/category.ts
import { db } from "@/lib/db";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import * as z from "zod";

export const categoryRouter = router({
  /**
   * Mengambil semua kategori utama (parentId IS NULL)
   * beserta daftar sub-kategorinya sekaligus
   */
  getAllWithSubcategories: publicProcedure.query(async () => {
    return await db.query.categories.findMany({
      where: {
        parentId: { isNull: true },
      },
      with: {
        subcategories: {
          orderBy: (sub, { asc }) => [asc(sub.name)],
        },
      },
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await db.query.categories.findFirst({
        where: {
          slug: input.slug,
        },
        with: {
          parent: true,
          subcategories: {
            orderBy: (sub, { asc }) => [asc(sub.name)],
          },
        },
      });

      return category ?? null;
    }),
});
