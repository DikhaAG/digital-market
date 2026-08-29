// src/server/services/settings.service.ts
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { unstable_cache, revalidateTag } from "next/cache";

export interface BrandLogoConfig {
  logoType: "text" | "image";
  logoText: string;
  logoTextAccent: string;
  logoImage: string;
}

export interface SiteMetadataConfig {
  siteTitle: string;
  siteDescription: string;
}

export interface AdminContactConfig {
  whatsappNumber: string;
}

export class SettingsService {
  /**
   * Sanitasi nomor WhatsApp ke format internasional standar wa.me (contoh: 62812xxx)
   */
  static formatWhatsAppNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("08")) {
      cleaned = "628" + cleaned.slice(2);
    }
    return cleaned;
  }
  /**
   * Mengambil nomor WhatsApp Admin ter-cache (Zero DB Overhead)
   */
  static getAdminContactCached = unstable_cache(
    async (): Promise<AdminContactConfig> => {
      const row = await db.query.siteSettings.findFirst({
        where: {
          key: "admin_whatsapp_number",
        },
      });

      const rawNumber =
        row?.value ||
        process.env.NEXT_PUBLIC_ADMIN_WA_NUMBER ||
        "6281234567890";
      return {
        whatsappNumber: SettingsService.formatWhatsAppNumber(rawNumber),
      };
    },
    ["admin-contact-settings"],
    {
      tags: ["site-settings"],
    },
  );

  /**
   * Memperbarui nomor kontak admin dan invalidate cache secara instan
   */
  static async updateAdminContact(whatsappNumber: string) {
    const formatted = SettingsService.formatWhatsAppNumber(whatsappNumber);

    await db
      .insert(siteSettings)
      .values({
        key: "admin_whatsapp_number",
        value: formatted,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: formatted, updatedAt: new Date() },
      });

    (revalidateTag as unknown as (tag: string) => void)("site-settings");
    return { success: true, whatsappNumber: formatted };
  }
  /**
   * Mengambil konfigurasi SEO & Metadata Global dari database ter-cache.
   */
  static getSiteMetadataCached = unstable_cache(
    async (): Promise<SiteMetadataConfig> => {
      const keys = [
        "site_meta_title",
        "site_meta_description",
        "brand_logo_text",
      ];

      const rows = await db
        .select()
        .from(siteSettings)
        .where(inArray(siteSettings.key, keys));

      const map = new Map(rows.map((r) => [r.key, r.value ?? ""]));
      const brandName = map.get("brand_logo_text") || "";

      return {
        siteTitle: map.get("site_meta_title") || brandName,
        siteDescription:
          map.get("site_meta_description") ||
          "Freelance Services Marketplace - Temukan talenta profesional untuk proyek Anda.",
      };
    },
    ["site-metadata-settings"],
    {
      tags: ["site-settings"],
    },
  );

  /**
   * Mengambil konfigurasi logo dari database dengan Next.js Data Cache Tagged.
   */
  static getBrandLogoCached = unstable_cache(
    async (): Promise<BrandLogoConfig> => {
      const keys = [
        "brand_logo_type",
        "brand_logo_text",
        "brand_logo_text_accent",
        "brand_logo_image",
      ];

      const rows = await db
        .select()
        .from(siteSettings)
        .where(inArray(siteSettings.key, keys));

      const map = new Map(rows.map((r) => [r.key, r.value ?? ""]));

      return {
        logoType: (map.get("brand_logo_type") as "text" | "image") || "text",
        logoText: map.get("brand_logo_text") || "",
        logoTextAccent: map.get("brand_logo_text_accent") || ".",
        logoImage: map.get("brand_logo_image") || "",
      };
    },
    ["brand-logo-settings"],
    {
      tags: ["site-settings"],
    },
  );

  /**
   * Memperbarui pengaturan logo dan melakukan On-Demand Cache Invalidation
   */
  static async updateBrandLogo(config: BrandLogoConfig) {
    const entries: Array<[string, string]> = [
      ["brand_logo_type", config.logoType],
      ["brand_logo_text", config.logoText],
      ["brand_logo_text_accent", config.logoTextAccent],
      ["brand_logo_image", config.logoImage],
    ];

    for (const [key, value] of entries) {
      await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedAt: new Date() },
        });
    }

    // Instantly invalidate tag cache seluruh aplikasi
    (revalidateTag as unknown as (tag: string) => void)("site-settings");
    return { success: true };
  }
}
