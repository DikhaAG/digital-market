import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, adminProcedure } from "@/lib/trpc/trpc"; // 👈 Impor adminProcedure
import { db } from "@/lib/db";
import {
  categories,
  packageFeatures,
  attributes,
  attributeOptions,
  gigs,
} from "@/lib/db/schema";
import { gigFormSchema } from "@/lib/validations/gig";
import {
  updateCategorySchema, // 👈 Import skema terpusat
} from "@/app/admin/categories/_schemas/category-admin.schema";
import { AdminService } from "@/server/services/admin.service";

export const adminRouter = router({
  // --------------------------------------------------------------------------
  // SECTION 1: GIG MANAGEMENT
  // --------------------------------------------------------------------------

  getCategoryGigMeta: adminProcedure
    .input(z.object({ categoryId: z.uuid() }))
    .query(async ({ input }) => {
      const categoryData = await db.query.categories.findFirst({
        where: {
          id: input.categoryId,
        },
        with: {
          attributes: { with: { options: true } },
          packageFeatures: true,
        },
      });

      return categoryData ?? { attributes: [], packageFeatures: [] };
    }),

  getGigDetail: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const gig = await db.query.gigs.findFirst({
        where: {
          id: input.id,
        },
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

  upsertGig: adminProcedure.input(gigFormSchema).mutation(async ({ input }) => {
    return await AdminService.upsertGig(input);
  }),

  getGigsForAudit: adminProcedure
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
      return await AdminService.getGigsForAudit(input);
    }),

  deleteGig: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(gigs).where(eq(gigs.id, input.id));
      return { success: true };
    }),

  getAllSellers: adminProcedure.query(async () => {
    return await db.query.user.findMany({
      orderBy: (u, { asc }) => [asc(u.name)],
    });
  }),

  // --------------------------------------------------------------------------
  // SECTION 2: CATEGORY MANAGEMENT
  // --------------------------------------------------------------------------

  getCategoryTree: adminProcedure.query(async () => {
    return await db.query.categories.findMany({
      where: {
        parentId: {
          isNull: true,
        },
      },
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
      orderBy: (cat, { asc }) => [asc(cat.name)],
    });
  }),

  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        slug: z.string().min(2),
        parentId: z.string().optional().nullable(),
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

  updateCategory: adminProcedure
    .input(updateCategorySchema)
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

  deleteCategory: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),

  // --------------------------------------------------------------------------
  // SECTION 3: ATTRIBUTES & OPTIONS MANAGEMENT
  // --------------------------------------------------------------------------

  createAttribute: adminProcedure
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

  deleteAttribute: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(attributes).where(eq(attributes.id, input.id));
      return { success: true };
    }),

  createAttributeOption: adminProcedure
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

  deleteAttributeOption: adminProcedure
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

  addPackageFeature: adminProcedure
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

  deletePackageFeature: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(packageFeatures).where(eq(packageFeatures.id, input.id));
      return { success: true };
    }),
});
