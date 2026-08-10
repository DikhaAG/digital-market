// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/lib/logger";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Membuat Signed Upload Signature untuk diizinkan oleh Cloudinary CDN
 */
export function generateCloudinarySignature(params: {
  folder: string;
  timestamp: number;
  public_id?: string;
}) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET belum dikonfigurasi di env.");
  }

  // Generate HMAC SHA-1 signature
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);

  return {
    signature,
    timestamp: params.timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  };
}

/**
 * Ekstrak Public ID dari URL Cloudinary untuk keperluan Hapus Gambar
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+)\.[a-z]+$/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    logger.error({ message: "Gagal mengekstrak Public ID Cloudinary", error });
    return null;
  }
}
