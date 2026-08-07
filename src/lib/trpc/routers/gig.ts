import { z } from "zod";
import { and, or, ilike, eq, gte, lte, sql, count, desc } from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc/trpc"; // Sesuaikan dengan lokasi setup tRPC Anda
import { db } from "@/lib/db";
import { gigs, categories, user, gigPackages } from "@/lib/db/schema";

export const gigRouter = router({
  // 1. Procedure untuk Mengambil Detail Gig Berdasarkan Slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const gig = await db.query.gigs.findFirst({
        where: {
          slug: input.slug,
        },
        with: {
          seller: true,
          category: {
            with: {
              parent: true,
            },
          },
          packages: {
            with: {
              featureValues: {
                with: {
                  feature: true,
                },
              },
            },
          },
          options: {
            with: {
              attribute: true,
            },
          },
        },
      });

      return gig ?? null;
    }),

  // 2. Procedure Pencarian & Filter Gig (Advanced Search)
  search: publicProcedure
    .input(
      z.object({
        q: z.string().trim().optional(),
        categoryId: z.uuid().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(12),
      }),
    )
    .query(async ({ input }) => {
      const { q, categoryId, minPrice, maxPrice, page, limit } = input;
      const offset = (page - 1) * limit;

      // Filter WHERE Dinamis
      const whereConditions = [];

      if (q && q !== "") {
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

      // Filter HAVING Dinamis (Untuk Agregasi Harga Paket Minimum)
      const havingConditions = [];
      if (minPrice !== undefined) {
        havingConditions.push(gte(sql`MIN(${gigPackages.price})`, minPrice));
      }
      if (maxPrice !== undefined) {
        havingConditions.push(lte(sql`MIN(${gigPackages.price})`, maxPrice));
      }
      const havingClause =
        havingConditions.length > 0 ? and(...havingConditions) : undefined;

      // Main Items Query
      const itemsQuery = db
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
          startingPrice:
            sql<number>`COALESCE(MIN(${gigPackages.price}), 0)`.mapWith(Number),
        })
        .from(gigs)
        .innerJoin(user, eq(gigs.sellerId, user.id))
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, user.id, categories.id)
        .having(havingClause)
        .orderBy(desc(gigs.createdAt))
        .limit(limit)
        .offset(offset);

      // Subquery Khusus Total Count Terfilter
      const countSubquery = db
        .select({ id: gigs.id })
        .from(gigs)
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, categories.id)
        .having(havingClause)
        .as("count_subquery");

      // Eksekusi Paralel (Items & Count)
      const [items, totalResult] = await Promise.all([
        itemsQuery,
        db.select({ total: count() }).from(countSubquery),
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
