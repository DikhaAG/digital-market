// src/server/services/admin.service.ts

import { and, count, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  gigs,
  gigAttributeOptions,
  gigPackages,
  gigPackageFeatureValues,
} from "@/lib/db/schema";
import { GigFormValues } from "@/lib/validations/gig";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class AdminService {
  /**
   * Mengambil Tree Kategori dengan Hitungan Gig yang Teroptimasi
   * Menjalankan kueri pohon kategori & kueri GROUP BY Gig secara paralel (< 30ms)
   */
  static async getCategoryTree() {
    const gigCountsQuery = db
      .select({
        categoryId: gigs.categoryId,
        totalGigs: count(),
      })
      .from(gigs)
      .groupBy(gigs.categoryId);

    const categoryTreeQuery = db.query.categories.findMany({
      where: { parentId: { isNull: true } },
      columns: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        image: true,
      },
      with: {
        subcategories: {
          columns: {
            id: true,
            parentId: true,
            name: true,
            slug: true,
            icon: true,
            image: true,
          },
          with: {
            attributes: {
              columns: { id: true, categoryId: true, name: true, slug: true },
              with: {
                options: {
                  columns: {
                    id: true,
                    attributeId: true,
                    label: true,
                    value: true,
                  },
                },
              },
            },
            packageFeatures: {
              columns: { id: true, categoryId: true, name: true, type: true },
            },
          },
        },
        attributes: {
          columns: { id: true, categoryId: true, name: true, slug: true },
          with: {
            options: {
              columns: {
                id: true,
                attributeId: true,
                label: true,
                value: true,
              },
            },
          },
        },
        packageFeatures: {
          columns: { id: true, categoryId: true, name: true, type: true },
        },
      },
      orderBy: (cat, { asc }) => [asc(cat.name)],
    });

    const [gigCounts, tree] = await Promise.all([
      gigCountsQuery,
      categoryTreeQuery,
    ]);

    const gigCountMap = new Map(
      gigCounts.map((item) => [item.categoryId, Number(item.totalGigs)]),
    );

    return tree.map((parent) => ({
      ...parent,
      subcategories: parent.subcategories.map((sub) => ({
        ...sub,
        gigCount: gigCountMap.get(sub.id) ?? 0,
      })),
    }));
  }

  /**
   * Optimized Upsert Gig dengan Eksekusi Batch Transaksi
   */
  static async upsertGig(input: GigFormValues) {
    return await db.transaction(async (tx: Transaction) => {
      let gigId = input.id;

      // 1. [gigs] Insert or Update Data Utama
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

      // 2. [gigAttributeOptions] Sync Junction Filter Atribut
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

      // 3. [gigPackages & gigPackageFeatureValues] Sync Paket Harga & Fitur
      await tx.delete(gigPackages).where(eq(gigPackages.gigId, gigId));

      if (input.packages.length > 0) {
        const insertedPackages = await tx
          .insert(gigPackages)
          .values(
            input.packages.map((pkg) => ({
              gigId: gigId!,
              packageType: pkg.packageType,
              title: pkg.title,
              description: pkg.description ?? null,
              price: pkg.price,
              deliveryTimeDays: pkg.deliveryTimeDays,
              revisions: pkg.revisions,
            })),
          )
          .returning({
            id: gigPackages.id,
            packageType: gigPackages.packageType,
          });

        const featureValuesToInsert = input.packages.flatMap((pkgInput) => {
          const matchedPkg = insertedPackages.find(
            (p) => p.packageType === pkgInput.packageType,
          );
          if (!matchedPkg || pkgInput.featureValues.length === 0) return [];

          return pkgInput.featureValues.map((fv) => ({
            gigPackageId: matchedPkg.id,
            packageFeatureId: fv.packageFeatureId,
            isIncluded: fv.isIncluded,
            value: fv.value ?? null,
          }));
        });

        if (featureValuesToInsert.length > 0) {
          await tx
            .insert(gigPackageFeatureValues)
            .values(featureValuesToInsert);
        }
      }

      return { success: true, gigId };
    });
  }

  /**
   * Audit Gig dengan RQB & Pagination
   */
  static async getGigsForAudit(input: {
    search?: string;
    categoryId?: string;
    sellerId?: string;
    sortBy: "createdAt" | "title";
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  }) {
    const { search, categoryId, sellerId, sortBy, sortOrder, page, limit } =
      input;
    const offset = (page - 1) * limit;

    const itemsQuery = db.query.gigs.findMany({
      where: {
        ...(search?.trim() ? { title: { ilike: `%${search.trim()}%` } } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(sellerId ? { sellerId } : {}),
      },
      orderBy: { [sortBy]: sortOrder },
      limit,
      offset,
      with: {
        seller: { columns: { id: true, name: true, image: true } },
        category: { columns: { id: true, name: true, slug: true } },
        gigAttributes: true,
        packages: {
          with: {
            featureValues: true,
          },
        },
      },
    });

    const conditions = [];
    if (search?.trim())
      conditions.push(ilike(gigs.title, `%${search.trim()}%`));
    if (categoryId) conditions.push(eq(gigs.categoryId, categoryId));
    if (sellerId) conditions.push(eq(gigs.sellerId, sellerId));

    const countQuery = db
      .select({ total: count() })
      .from(gigs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const [items, totalResult] = await Promise.all([itemsQuery, countQuery]);
    const total = Number(totalResult[0]?.total ?? 0);

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
