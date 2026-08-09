//src/lib/trpc/routers/admin.ts
import { z } from "zod";
import { and, count, eq, ilike } from "drizzle-orm";
import { router, publicProcedure } from "@/lib/trpc/trpc";
import { db } from "@/lib/db";
import {
  categories,
  packageFeatures,
  attributes,
  attributeOptions,
  gigs,
  gigAttributeOptions,
  gigPackages,
  gigPackageFeatureValues,
} from "@/lib/db/schema";
import { gigFormSchema, type GigFormValues } from "@/lib/validations/gig";

// Tipe eksplisit untuk transaksi Drizzle ORM
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ============================================================================
// HELPER FUNCTIONS (BUSINESS LOGIC)
// ============================================================================

/**
 * Eksekusi transaksi atomik untuk Insert/Update Gig beserta seluruh relasinya.
 */
async function executeGigUpsert(tx: Transaction, input: GigFormValues) {
  let gigId = input.id;

  // 1. Upsert Data Utama Gig
  if (gigId) {
    await tx
      .update(gigs)
      .set({
        sellerId: input.sellerId,
        categoryId: input.categoryId,
        title: input.title,
        slug: input.slug,
        about: input.about ?? null,
        coverImage: input.coverImage || null,
      })
      .where(eq(gigs.id, gigId));
  } else {
    const [inserted] = await tx
      .insert(gigs)
      .values({
        sellerId: input.sellerId,
        categoryId: input.categoryId,
        title: input.title,
        slug: input.slug,
        about: input.about ?? null,
        coverImage: input.coverImage || null,
      })
      .returning({ id: gigs.id });
    gigId = inserted.id;
  }

  // 2. Sync Junction Attribute Options (Re-insert Approach)
  await tx
    .delete(gigAttributeOptions)
    .where(eq(gigAttributeOptions.gigId, gigId));

  if (input.attributeOptionIds.length > 0) {
    await tx.insert(gigAttributeOptions).values(
      input.attributeOptionIds.map((optionId) => ({
        gigId: gigId!,
        attributeOptionId: optionId,
      })),
    );
  }

  // 3. Sync Packages & Feature Values (Cascade Delete Package lama)
  await tx.delete(gigPackages).where(eq(gigPackages.gigId, gigId));

  for (const pkgInput of input.packages) {
    const [insertedPkg] = await tx
      .insert(gigPackages)
      .values({
        gigId: gigId!,
        packageType: pkgInput.packageType,
        title: pkgInput.title,
        description: pkgInput.description ?? null,
        price: pkgInput.price,
        deliveryTimeDays: pkgInput.deliveryTimeDays,
        revisions: pkgInput.revisions,
      })
      .returning({ id: gigPackages.id });

    if (pkgInput.featureValues.length > 0) {
      await tx.insert(gigPackageFeatureValues).values(
        pkgInput.featureValues.map((fv) => ({
          gigPackageId: insertedPkg.id,
          packageFeatureId: fv.packageFeatureId,
          isIncluded: fv.isIncluded,
          value: fv.value ?? null,
        })),
      );
    }
  }

  return { success: true, gigId };
}

// ============================================================================
// ADMIN TRPC ROUTER
// ============================================================================

export const adminRouter = router({
  // --------------------------------------------------------------------------
  // SECTION 1: GIG MANAGEMENT
  // --------------------------------------------------------------------------

  getCategoryGigMeta: publicProcedure
    .input(z.object({ categoryId: z.uuid() }))
    .query(async ({ input }) => {
      const categoryData = await db.query.categories.findFirst({
        where: { id: input.categoryId },
        with: {
          attributes: { with: { options: true } },
          packageFeatures: true,
        },
      });

      return categoryData ?? { attributes: [], packageFeatures: [] };
    }),

  getGigDetail: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const gig = await db.query.gigs.findFirst({
        where: { id: input.id },
        with: {
          seller: true,
          category: true,
          gigAttributes: true,
          packages: { with: { featureValues: true } },
        },
      });

      if (!gig) throw new Error("Gig tidak ditemukan");
      return gig;
    }),

  upsertGig: publicProcedure
    .input(gigFormSchema)
    .mutation(async ({ input }) => {
      return await db.transaction(async (tx) => {
        return await executeGigUpsert(tx, input);
      });
    }),

  getGigsForAudit: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        categoryId: z.uuid().optional(),
        sellerId: z.string().optional(),
        sortBy: z.enum(["createdAt", "title"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).default(10),
      }),
    )
    .query(async ({ input }) => {
      const { search, categoryId, sellerId, sortBy, sortOrder, page, limit } =
        input;
      const offset = (page - 1) * limit;

      // Filter RQB v2 untuk list items
      const items = await db.query.gigs.findMany({
        where: {
          ...(search?.trim() ? { title: { ilike: `%${search.trim()}%` } } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(sellerId ? { sellerId } : {}),
        },
        limit,
        offset,
        orderBy: { [sortBy]: sortOrder },
        with: {
          seller: true,
          category: true,
          packages: true,
        },
      });

      // Filter SQL Builder untuk Count Query
      const conditions = [];
      if (search?.trim())
        conditions.push(ilike(gigs.title, `%${search.trim()}%`));
      if (categoryId) conditions.push(eq(gigs.categoryId, categoryId));
      if (sellerId) conditions.push(eq(gigs.sellerId, sellerId));

      const whereExpr = conditions.length > 0 ? and(...conditions) : undefined;

      const [totalResult] = await db
        .select({ total: count() })
        .from(gigs)
        .where(whereExpr);

      const total = totalResult?.total ?? 0;

      return {
        items,
        total,
        totalPages: Math.ceil(total / limit),
      };
    }),

  deleteGig: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(gigs).where(eq(gigs.id, input.id));
      return { success: true };
    }),

  getAllSellers: publicProcedure.query(async () => {
    return await db.query.user.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // --------------------------------------------------------------------------
  // SECTION 2: CATEGORY MANAGEMENT
  // --------------------------------------------------------------------------

  getCategoryTree: publicProcedure.query(async () => {
    return await db.query.categories.findMany({
      where: { parentId: { isNull: true } },
      with: {
        subcategories: {
          with: {
            attributes: { with: { options: true } },
            packageFeatures: true,
            gigs: { columns: { id: true } },
          },
        },
        attributes: { with: { options: true } },
        packageFeatures: true,
        gigs: { columns: { id: true } },
      },
      orderBy: { name: "asc" },
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

  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.uuid(),
        name: z.string().min(2),
        slug: z.string().min(2),
        icon: z.string().optional().nullable(),
        image: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(categories)
        .set({
          name: input.name,
          slug: input.slug,
          icon: input.icon,
          image: input.image,
        })
        .where(eq(categories.id, input.id))
        .returning();

      return updated;
    }),

  deleteCategory: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),

  // --------------------------------------------------------------------------
  // SECTION 3: ATTRIBUTES & OPTIONS MANAGEMENT
  // --------------------------------------------------------------------------

  createAttribute: publicProcedure
    .input(
      z.object({
        categoryId: z.uuid(),
        name: z.string().min(2),
        slug: z.string().min(2),
      }),
    )
    .mutation(async ({ input }) => {
      const [newAttr] = await db
        .insert(attributes)
        .values({
          categoryId: input.categoryId,
          name: input.name,
          slug: input.slug,
        })
        .returning();

      return newAttr;
    }),

  deleteAttribute: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(attributes).where(eq(attributes.id, input.id));
      return { success: true };
    }),

  createAttributeOption: publicProcedure
    .input(
      z.object({
        attributeId: z.uuid(),
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const [newOption] = await db
        .insert(attributeOptions)
        .values({
          attributeId: input.attributeId,
          label: input.label,
          value: input.value,
        })
        .returning();

      return newOption;
    }),

  deleteAttributeOption: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db
        .delete(attributeOptions)
        .where(eq(attributeOptions.id, input.id));
      return { success: true };
    }),

  // --------------------------------------------------------------------------
  // SECTION 4: PACKAGE FEATURES MASTER MANAGEMENT
  // --------------------------------------------------------------------------

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
});
