// src/server/routers/admin.ts
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure, superAdminProcedure } from "@/lib/trpc/trpc";
import { db } from "@/lib/db";
import { categories, gigs, user } from "@/lib/db/schema";
import { gigFormSchema } from "@/lib/validations/gig";
import { AdminService } from "@/server/services/admin.service";

export const adminRouter = router({
  // --------------------------------------------------------------------------
  // ADMIN & SUPER ADMIN SHARED PROCEDURES
  // --------------------------------------------------------------------------
  getCategoryGigMeta: adminProcedure
    .input(
      z.object({ categoryId: z.string().min(1, "Category ID wajib diisi") }),
    )
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

  getGigDetail: adminProcedure
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

      if (!gig) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gig tidak ditemukan",
        });
      }
      return gig;
    }),

  upsertGig: adminProcedure
    .input(gigFormSchema)
    .mutation(async ({ input, ctx }) => {
      // 1. Jika mode Update (id ada), verifikasi pemilik gig
      if (input.id) {
        const existingGig = await db.query.gigs.findFirst({
          where: {
            id: input.id,
          },
          columns: { sellerId: true },
        });

        if (!existingGig) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Gig tidak ditemukan",
          });
        }

        if (
          ctx.user.role !== "super_admin" &&
          existingGig.sellerId !== ctx.user.id
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anda tidak memiliki akses untuk mengubah Gig ini",
          });
        }
      }

      // 2. Pastikan Seller biasa tidak bisa memalsukan sellerId milik orang lain saat membuat Gig baru
      const targetSellerId =
        ctx.user.role === "super_admin" ? input.sellerId : ctx.user.id;

      return await AdminService.upsertGig({
        ...input,
        sellerId: targetSellerId,
      });
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

  getAllSellers: adminProcedure.query(async () => {
    return await db.query.user.findMany({
      where: {
        role: { in: ["admin", "super_admin"] },
        banned: false,
      },
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  getCategoryTree: adminProcedure.query(async () => {
    return await AdminService.getCategoryTree();
  }),

  /** Soft Delete / Arsip Gig oleh Admin (Seller) atau Super Admin */
  softDeleteGig: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const gig = await db.query.gigs.findFirst({
        where: {
          id: input.id,
        },
        columns: { id: true, sellerId: true, deletedAt: true },
      });

      if (!gig || gig.deletedAt !== null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gig tidak ditemukan atau sudah diarsipkan",
        });
      }

      // Enforcement: Seller biasa hanya boleh mengarsipkan Gig miliknya sendiri
      if (ctx.user.role !== "super_admin" && gig.sellerId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak memiliki hak akses untuk mengarsipkan Gig ini",
        });
      }

      const [updated] = await db
        .update(gigs)
        .set({ deletedAt: new Date() })
        .where(eq(gigs.id, input.id))
        .returning();

      return updated;
    }),

  /** Pemulihan (Restore) Gig oleh Admin (Seller) atau Super Admin */
  restoreGig: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const gig = await db.query.gigs.findFirst({
        where: {
          id: input.id,
        },
        columns: { id: true, sellerId: true, deletedAt: true },
      });

      if (!gig || gig.deletedAt === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gig tidak ditemukan atau statusnya sedang aktif",
        });
      }

      // Enforcement: Seller biasa hanya boleh memulihkan Gig miliknya sendiri
      if (ctx.user.role !== "super_admin" && gig.sellerId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak memiliki hak akses untuk memulihkan Gig ini",
        });
      }

      const [restored] = await db
        .update(gigs)
        .set({ deletedAt: null })
        .where(eq(gigs.id, input.id))
        .returning();

      return restored;
    }),

  // --------------------------------------------------------------------------
  // SUPER ADMIN EXCLUSIVE PROCEDURES (Best Practice Governance)
  // --------------------------------------------------------------------------

  /** Mengambil seluruh akun pengelola untuk audit sistem */
  getAllAdminAccounts: superAdminProcedure.query(async () => {
    return await db.query.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Mengubah Role Pengguna (Promote/Demote antara Admin & Super Admin) */
  updateUserRole: superAdminProcedure
    .input(
      z.object({
        targetUserId: z.string().min(1),
        newRole: z.enum(["admin", "super_admin"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Anda tidak dapat mengubah role diri Anda sendiri",
        });
      }

      const [updated] = await db
        .update(user)
        .set({ role: input.newRole })
        .where(eq(user.id, input.targetUserId))
        .returning();

      return updated;
    }),

  /** Bekukan/Aktifkan Akses Pengelola (Banned Status) */
  toggleUserBanStatus: superAdminProcedure
    .input(
      z.object({
        targetUserId: z.string().min(1),
        banned: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Anda tidak dapat membekukan akun sendiri",
        });
      }

      const [updated] = await db
        .update(user)
        .set({ banned: input.banned })
        .where(eq(user.id, input.targetUserId))
        .returning();

      return updated;
    }),

  /** Hapus Gig secara permanen oleh Super Admin (Hard Delete) */
  deleteGig: superAdminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(gigs).where(eq(gigs.id, input.id));
      return { success: true };
    }),

  /** Hapus Kategori secara permanen oleh Super Admin */
  deleteCategory: superAdminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
