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
   * Eksekusi transaksi atomik Upsert Gig beserta relasinya.
   * (Operasi CUD/Mutasi tetap menggunakan Core Query Builder pada objek transaksi `tx`)
   */
  static async upsertGig(input: GigFormValues) {
    return await db.transaction(async (tx: Transaction) => {
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

      // 2. Sync Junction Attribute Options
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

      // 3. Sync Packages & Feature Values
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
  }

  /**
   * Ambil daftar Gig untuk Audit menggunakan RQB v2
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

    // 1. Relational Query v2 dengan Object Filter & Object OrderBy Syntax
    const itemsQuery = db.query.gigs.findMany({
      where: {
        ...(search?.trim() ? { title: { ilike: `%${search.trim()}%` } } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(sellerId ? { sellerId } : {}),
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      limit,
      offset,
      with: {
        seller: true,
        category: true,
        packages: true,
      },
    });

    // 2. Count Query tetap menggunakan Core SQL Builder
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
