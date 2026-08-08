import { z } from "zod";
import {
  and,
  or,
  ilike,
  eq,
  gte,
  lte,
  sql,
  count,
  desc,
  asc,
} from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import { db } from "@/lib/db";
import { gigs, categories, user, gigPackages } from "@/lib/db/schema";

export const gigRouter = router({
  search: publicProcedure
    .input(
      z.object({
        q: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        sortBy: z
          .enum(["relevance", "newest", "price_asc", "price_desc"])
          .default("relevance"),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(12),
      }),
    )
    .query(async ({ input }) => {
      const { q, categoryId, minPrice, maxPrice, sortBy, page, limit } = input;
      const offset = (page - 1) * limit;

      // 1. Filter WHERE Dinamis
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

      // 2. Filter HAVING Dinamis (Agregasi Rentang Harga)
      const havingConditions = [];
      if (minPrice !== undefined) {
        havingConditions.push(gte(sql`MIN(${gigPackages.price})`, minPrice));
      }
      if (maxPrice !== undefined) {
        havingConditions.push(lte(sql`MIN(${gigPackages.price})`, maxPrice));
      }
      const havingClause =
        havingConditions.length > 0 ? and(...havingConditions) : undefined;

      // 3. Dynamic Ordering
      let orderByClause;
      switch (sortBy) {
        case "newest":
          orderByClause = desc(gigs.createdAt);
          break;
        case "price_asc":
          orderByClause = asc(sql`MIN(${gigPackages.price})`);
          break;
        case "price_desc":
          orderByClause = desc(sql`MIN(${gigPackages.price})`);
          break;
        case "relevance":
        default:
          orderByClause = desc(gigs.createdAt);
          break;
      }

      // 4. Main Query
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
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      // 5. Count Subquery
      const countSubquery = db
        .select({ id: gigs.id })
        .from(gigs)
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, categories.id)
        .having(havingClause)
        .as("count_subquery");

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
