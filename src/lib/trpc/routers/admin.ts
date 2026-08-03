import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import {
  categories,
  gigs,
  user,
  packageFeatures,
  gigPackages,
} from "@/lib/db/schema";
import { eq, count, sql, ilike } from "drizzle-orm";

export const adminRouter = router({
  // ================= 1. DASHBOARD METRICS =================
  getDashboardStats: publicProcedure.query(async () => {
    const [userCount] = await db.select({ value: count() }).from(user);
    const [gigCount] = await db.select({ value: count() }).from(gigs);
    const [categoryCount] = await db
      .select({ value: count() })
      .from(categories);

    // Hitung rata-rata harga paket layanan secara keseluruhan
    const [avgPrice] = await db
      .select({
        avg: sql<number>`COALESCE(AVG(${gigPackages.price}), 0)`.mapWith(
          Number,
        ),
      })
      .from(gigPackages);

    return {
      totalUsers: userCount?.value ?? 0,
      totalGigs: gigCount?.value ?? 0,
      totalCategories: categoryCount?.value ?? 0,
      averagePackagePrice: Math.round(avgPrice?.avg ?? 0),
    };
  }),

  // ================= 2. HIERARCHICAL CATEGORY MANAGEMENT =================
  getCategoryTree: publicProcedure.query(async () => {
    // Ambil Kategori Utama (Parent) beserta Sub-kategori, Attributes, dan Package Features
    return await db.query.categories.findMany({
      where: {
        parentId: {
          isNull: true,
        },
      },
      with: {
        subcategories: {
          with: {
            attributes: {
              with: { options: true },
            },
            packageFeatures: true,
          },
        },
        attributes: {
          with: { options: true },
        },
        packageFeatures: true,
      },
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  createCategory: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        slug: z.string().min(2),
        parentId: z.uuid().optional().nullable(),
        icon: z.string().optional().nullable(),
        image: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const [newCategory] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug: input.slug,
          parentId: input.parentId ?? null,
          icon: input.icon ?? null,
          image: input.image ?? null,
        })
        .returning();
      return newCategory;
    }),

  // ================= 3. PACKAGE FEATURES MASTER MANAGEMENT =================
  addPackageFeature: publicProcedure
    .input(
      z.object({
        categoryId: z.uuid(),
        name: z.string().min(2),
        type: z.enum(["boolean", "text", "number"]),
      }),
    )
    .mutation(async ({ input }) => {
      const [newFeature] = await db
        .insert(packageFeatures)
        .values({
          categoryId: input.categoryId,
          name: input.name,
          type: input.type,
        })
        .returning();
      return newFeature;
    }),

  deletePackageFeature: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(packageFeatures).where(eq(packageFeatures.id, input.id));
      return { success: true };
    }),

  // ================= 4. GIG AUDIT & MODERATION =================
  getGigsForAudit: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { search, page, limit } = input;
      const offset = (page - 1) * limit;

      const whereCondition = search
        ? ilike(gigs.title, `%${search}%`)
        : undefined;

      const items = await db.query.gigs.findMany({
        where: search ? { title: { ilike: `%${search}%` } } : undefined,
        limit,
        offset,
        orderBy: { createdAt: "desc" },
        with: {
          seller: true,
          category: true,
          packages: true,
        },
      });

      const [totalResult] = await db
        .select({ total: count() })
        .from(gigs)
        .where(whereCondition);

      return {
        items,
        total: totalResult?.total ?? 0,
        totalPages: Math.ceil((totalResult?.total ?? 0) / limit),
      };
    }),

  deleteGig: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(gigs).where(eq(gigs.id, input.id));
      return { success: true };
    }),
});
