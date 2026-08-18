//src/lib/trpc/routers/gig.ts
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
import {
  gigs,
  categories,
  user,
  gigPackages,
  gigAttributeOptions,
} from "@/lib/db/schema";

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

export const searchGigsInputSchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .describe(
      "Kata kunci pencarian bebas (mencari pada title, about, dan category.name)",
    ),

  categorySlug: z
    .string()
    .trim()
    .optional()
    .catch(undefined)
    .describe(
      "Slug unik kategori. Mendukung filter otomatis untuk parent & sub-kategori",
    ),

  minPrice: z
    .number()
    .min(0, "Harga minimum tidak boleh negatif")
    .optional()
    .describe("Filter batas harga terendah ($)"),

  maxPrice: z
    .number()
    .min(0, "Harga maksimum tidak boleh negatif")
    .optional()
    .describe("Filter batas harga tertinggi ($)"),

  sortBy: z
    .enum(["relevance", "newest", "price_asc", "price_desc"])
    .default("relevance")
    .describe("Mode pengurutan data"),

  attributeOptionIds: z.array(z.string()).optional(),

  page: z
    .number()
    .int()
    .min(1)
    .default(1)
    .describe("Halaman yang ingin diambil"),

  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(12)
    .describe("Batas jumlah data per halaman (maksimal 100)"),
});

export type SearchGigsInput = z.infer<typeof searchGigsInputSchema>;

// ============================================================================
// ROUTER DEFINITION
// ============================================================================

export const gigRouter = router({
  getCategoryAttributes: publicProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.categorySlug) return [];

      const category = await db.query.categories.findFirst({
        where: {
          slug: input.categorySlug,
        },
        with: {
          attributes: {
            with: {
              options: true,
            },
          },
        },
      });

      return category?.attributes ?? [];
    }),

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
        },
      });

      return gig ?? null;
    }),

  search: publicProcedure
    .input(searchGigsInputSchema)
    .query(async ({ input }) => {
      const {
        q,
        categorySlug,
        minPrice,
        maxPrice,
        sortBy,
        attributeOptionIds,
        page,
        limit,
      } = input;
      const offset = (page - 1) * limit;

      // ----------------------------------------------------------------------
      // 1. KONDISI WHERE
      // ----------------------------------------------------------------------
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

      if (categorySlug && categorySlug !== "") {
        whereConditions.push(
          or(
            eq(categories.slug, categorySlug),
            sql`EXISTS (
              SELECT 1 FROM ${categories} AS parent_cat 
              WHERE parent_cat.id = ${categories.parentId} 
              AND parent_cat.slug = ${categorySlug}
            )`,
          ),
        );
      }

      if (attributeOptionIds && attributeOptionIds.length > 0) {
        whereConditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${gigAttributeOptions} AS gao 
            WHERE gao.gig_id = ${gigs.id} 
            AND gao.attribute_option_id IN ${attributeOptionIds}
          )`,
        );
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // ----------------------------------------------------------------------
      // 2. KONDISI HAVING
      // ----------------------------------------------------------------------
      const havingConditions = [];
      if (minPrice !== undefined) {
        havingConditions.push(gte(sql`MIN(${gigPackages.price})`, minPrice));
      }
      if (maxPrice !== undefined) {
        havingConditions.push(lte(sql`MIN(${gigPackages.price})`, maxPrice));
      }
      const havingClause =
        havingConditions.length > 0 ? and(...havingConditions) : undefined;

      // ----------------------------------------------------------------------
      // 3. PENGURUTAN DATA (Sorting)
      // ----------------------------------------------------------------------
      let orderByClause;
      switch (sortBy) {
        case "newest":
          orderByClause = [desc(gigs.createdAt)];
          break;
        case "price_asc":
          orderByClause = [
            asc(sql`MIN(${gigPackages.price})`),
            desc(gigs.createdAt),
          ];
          break;
        case "price_desc":
          orderByClause = [
            desc(sql`MIN(${gigPackages.price})`),
            desc(gigs.createdAt),
          ];
          break;
        case "relevance":
        default:
          if (q && q.trim() !== "") {
            const searchTerm = `%${q.trim()}%`;
            orderByClause = [
              desc(
                sql`CASE WHEN ${gigs.title} ILIKE ${searchTerm} THEN 2 ELSE 1 END`,
              ),
              desc(gigs.createdAt),
            ];
          } else {
            orderByClause = [desc(gigs.createdAt)];
          }
          break;
      }

      // ----------------------------------------------------------------------
      // 4. KUERI UTAMA & HITUNG TOTAL
      // ----------------------------------------------------------------------
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
        .orderBy(...orderByClause) // 👈 SPREAD OPERATOR DI SINI (Memperbaiki Error 2769)
        .limit(limit)
        .offset(offset);

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

      // ----------------------------------------------------------------------
      // 5. RESPONS TERFORMAT
      // ----------------------------------------------------------------------
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
