// src/server/routers/upload.ts
import { z } from "zod";
import { router, adminProcedure } from "@/lib/trpc/trpc";
import {
  cloudinary,
  generateCloudinarySignature,
  getPublicIdFromUrl,
} from "@/lib/cloudinary";
import { TRPCError } from "@trpc/server";

export const uploadRouter = router({
  /**
   * Mendapatkan Token Tanda Tangan untuk Upload Langsung dari Browser
   */
  getSignedUploadParams: adminProcedure
    .input(
      z.object({
        folder: z.string().default("marketplace/gigs"),
      }),
    )
    .mutation(async ({ input }) => {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const params = generateCloudinarySignature({
        folder: input.folder,
        timestamp,
      });

      return {
        ...params,
        folder: input.folder,
      };
    }),

  /**
   * Menghapus File Gambar di Cloudinary berdasarkan URL / Public ID
   */
  deleteImage: adminProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const publicId = getPublicIdFromUrl(input.imageUrl);
      if (!publicId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Format URL Cloudinary tidak valid",
        });
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return { success: result.result === "ok" };
    }),
});
