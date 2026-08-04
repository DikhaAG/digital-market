import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import {
  categories,
  packageFeatures,
  attributes,
  attributeOptions,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const adminRouter = router({
  // ================= 1. HIERARCHICAL CATEGORY DATA =================
  getCategoryTree: publicProcedure.query(async () => {
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
            gigs: { columns: { id: true } },
          },
        },
        attributes: {
          with: { options: true },
        },
        packageFeatures: true,
        gigs: { columns: { id: true } },
      },
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  // ================= 2. CATEGORY CRUD =================
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

  // ================= 3. FILTER ATTRIBUTES & OPTIONS CRUD =================
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

  // ================= 4. PACKAGE FEATURES MASTER CRUD =================
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
