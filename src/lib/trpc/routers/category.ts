import { db } from "@/lib/db";
import { publicProcedure, router } from "../server";

export const categoryRouter = router({
  /**
   * Mengambil semua kategori utama (parentId IS NULL)
   * beserta daftar sub-kategorinya sekaligus
   */
  getAllWithSubcategories: publicProcedure.query(async () => {
    const data = await db.query.categories.findMany({
      where: {
        parentId: { isNull: true },
      },
      with: {
        subcategories: true, // Auto-join ke tabel subCategories
      },
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });

    return data;
  }),
});
