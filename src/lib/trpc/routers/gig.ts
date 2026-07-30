import { z } from "zod";
import { gigs, categories, user, gigPackages } from "@/lib/db/schema";
import { and, or, ilike, eq, gte, lte, sql, count, desc } from "drizzle-orm";
import { publicProcedure, router } from "../server";
import { db } from "@/lib/db";

export const gigRouter = router({
  search: publicProcedure
    .input(
      z.object({
        q: z.string().trim().optional(),
        categoryId: z.uuid().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        page: z.number().int().min(1).default(1), // ✅ Validasi batas aman
        limit: z.number().int().min(1).max(100).default(12), // ✅ Mencegah DoS
      }),
    )
    .query(async ({ input }) => {
      const { q, categoryId, minPrice, maxPrice, page, limit } = input;
      const offset = (page - 1) * limit;

      // 1. Filter WHERE Dinamis
      const whereConditions = [];

      if (q) {
        const searchTerm = `%${q}%`;
        whereConditions.push(
          or(
            ilike(gigs.title, searchTerm),
            ilike(gigs.about, searchTerm),
            ilike(categories.name, searchTerm),
          ),
        );
      }

      if (categoryId) {
        whereConditions.push(eq(gigs.categoryId, categoryId));
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // 2. Filter HAVING Dinamis
      const havingConditions = [];
      if (minPrice !== undefined) {
        havingConditions.push(gte(sql`MIN(${gigPackages.price})`, minPrice));
      }
      if (maxPrice !== undefined) {
        havingConditions.push(lte(sql`MIN(${gigPackages.price})`, maxPrice));
      }
      const havingClause =
        havingConditions.length > 0 ? and(...havingConditions) : undefined;

      // 3. Base Query sebagai Subquery (Memastikan filter items & total 100% konsisten)
      const filteredGigsQuery = db
        .select({
          id: gigs.id,
          title: gigs.title,
          slug: gigs.slug,
          coverImage: gigs.coverImage,
          createdAt: gigs.createdAt,
          seller: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
          startingPrice: sql<number>`MIN(${gigPackages.price})`.mapWith(Number),
        })
        .from(gigs)
        .innerJoin(user, eq(gigs.sellerId, user.id))
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, user.id, categories.id)
        .having(havingClause)
        .as("filtered_gigs");

      // 4. Eksekusi Paralel (Items & Total Count) untuk Performa Maksimal
      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(filteredGigsQuery)
          .orderBy(desc(filteredGigsQuery.createdAt))
          .limit(limit)
          .offset(offset),

        db.select({ total: count() }).from(filteredGigsQuery), // ✅ FIXED: Menghitung total dari subquery yang sama
      ]);

      const total = Number(totalResult[0]?.total ?? 0);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
