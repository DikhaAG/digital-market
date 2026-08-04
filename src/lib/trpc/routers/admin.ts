import { z } from "zod";
import { router, publicProcedure } from "../trpc";
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
import { count, eq, ilike } from "drizzle-orm";
import { gigFormSchema } from "@/lib/validations/gig";

export const adminRouter = router({
  // ================= 1. GET CATEGORY META FOR GIG FORM =================
  // Mengambil atribut & package features dinamis berdasarkan kategori yang dipilih
  getCategoryGigMeta: publicProcedure
    .input(z.object({ categoryId: z.uuid() }))
    .query(async ({ input }) => {
      const categoryData = await db.query.categories.findFirst({
        where: {
          id: input.categoryId,
        },
        with: {
          attributes: {
            with: { options: true },
          },
          packageFeatures: true,
        },
      });

      return categoryData ?? { attributes: [], packageFeatures: [] };
    }),

  // ================= 2. GET FULL GIG DETAILS FOR EDIT =================
  getGigDetail: publicProcedure
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
          packages: {
            with: {
              featureValues: true,
            },
          },
        },
      });

      if (!gig) throw new Error("Gig tidak ditemukan");
      return gig;
    }),

  // ================= 3. ATOMIC UPSERT GIG WITH RELATIONS =================
  upsertGig: publicProcedure
    .input(gigFormSchema)
    .mutation(async ({ input }) => {
      return await db.transaction(async (tx) => {
        let gigId = input.id;

        // A. Upsert ke Tabel Gigs
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

        // B. Update Junction Gig Attribute Options (Hapus lalu Insert ulang)
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

        // C. Clean & Re-insert Packages & Feature Values
        // Hapus paket lama (Cascade delete akan otomatis menghapus gigPackageFeatureValues)
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
      });
    }),

  // ================= 4. GIG AUDIT LIST =================
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
        orderBy: (gigs, { desc }) => [desc(gigs.createdAt)],
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

  // Helper mendapatkan daftar Seller untuk pilihan dropdown
  getAllSellers: publicProcedure.query(async () => {
    return await db.query.user.findMany({
      orderBy: (user, { asc }) => [asc(user.name)],
    });
  }),
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
