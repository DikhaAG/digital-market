//src/lib/trpc/routers/gig.ts
import { z } from "zod";
import {
  and,
  or,
  ilike,
  eq,
  gte,
  lte,
  sql,
  count,
  desc,
  asc,
} from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import { db } from "@/lib/db";
import { gigs, categories, user, gigPackages } from "@/lib/db/schema";

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

/**
 * Skema validasi input untuk prosedur pencarian dan penyaringan Gig.
 *
 * Menggunakan sanitasi string otomatis (`trim`) dan pembatas rentang
 * angka untuk mencegah kueri database yang tidak efisien.
 */
export const searchGigsInputSchema = z.object({
  /** Kata kunci pencarian untuk judul gig, deskripsi 'about', atau nama kategori */
  q: z
    .string()
    .trim()
    .optional()
    .describe(
      "Kata kunci pencarian bebas (mencari pada title, about, dan category.name)",
    ),

  /** URL Slug dari kategori utama atau sub-kategori */
  categorySlug: z
    .string()
    .trim()
    .optional()
    .catch(undefined)
    .describe(
      "Slug unik kategori. Mendukung filter otomatis untuk parent & sub-kategori",
    ),

  /** Batas harga minimum berdasarkan harga paket terkecil */
  minPrice: z
    .number()
    .min(0, "Harga minimum tidak boleh negatif")
    .optional()
    .describe("Filter batas harga terendah ($)"),

  /** Batas harga maksimum berdasarkan harga paket terkecil */
  maxPrice: z
    .number()
    .min(0, "Harga maksimum tidak boleh negatif")
    .optional()
    .describe("Filter batas harga tertinggi ($)"),

  /** Kriteria pengurutan hasil */
  sortBy: z
    .enum(["relevance", "newest", "price_asc", "price_desc"])
    .default("relevance")
    .describe("Mode pengurutan data"),

  /** Nomor halaman aktif (1-based index) */
  page: z
    .number()
    .int()
    .min(1)
    .default(1)
    .describe("Halaman yang ingin diambil"),

  /** Jumlah item per halaman */
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(12)
    .describe("Batas jumlah data per halaman (maksimal 100)"),
});

/** Tipe inferensi TypeScript untuk input pencarian Gig */
export type SearchGigsInput = z.infer<typeof searchGigsInputSchema>;

// ============================================================================
// ROUTER DEFINITION
// ============================================================================

/**
 * Router tRPC untuk mengelola entitas Gig/Layanan Freelance.
 */
export const gigRouter = router({
  /**
   * Mengambil detail Gig berdasarkan slug beserta relasi Seller, Category, dan Packages
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const gig = await db.query.gigs.findFirst({
        where: {
          slug: input.slug,
        },
        with: {
          seller: true,
          category: {
            with: {
              parent: true,
            },
          },
          packages: {
            with: {
              featureValues: {
                with: {
                  feature: true,
                },
              },
            },
          },
        },
      });

      return gig ?? null;
    }),
  /**
   * Mengambil daftar Gig berdasarkan kriteria pencarian, filter kategori, rentang harga, dan paginasi.
   *
   * @remarks
   * **Fitur & Perilaku Kueri:**
   * 1. **Pencarian Teks Bebas (`q`):** Menggunakan kueri `ILIKE` case-insensitive pada judul, deskripsi `about`, dan nama kategori.
   * 2. **Hierarki Kategori (`categorySlug`):** Menggunakan kueri `EXISTS` untuk mencocokkan Gig jika `categorySlug` adalah kategori langsung **atau** induk (*parent category*) dari Gig tersebut.
   * 3. **Agregasi Harga Terendah:** Menghitung `startingPrice` dinamis menggunakan agregasi `MIN(gig_packages.price)` melalui klausa `HAVING`.
   * 4. **Eksekusi Paralel:** Kueri item dan hitung total data dijalankan secara bersamaan menggunakan `Promise.all`.
   *
   * @param input - Objek kriteria penyaringan {@link SearchGigsInput}
   * @returns Objek yang berisi daftar item Gig dan metadata paginasi
   *
   * @example
   * Pemanggilan dari React Client (Next.js):
   * ```tsx
   * const { data, isLoading } = trpc.gig.search.useQuery({
   *   q: "logo design",
   *   categorySlug: "graphics-design",
   *   minPrice: 10,
   *   maxPrice: 100,
   *   sortBy: "price_asc",
   *   page: 1,
   *   limit: 12,
   * });
   * ```
   */
  search: publicProcedure
    .input(searchGigsInputSchema)
    .query(async ({ input }) => {
      const { q, categorySlug, minPrice, maxPrice, sortBy, page, limit } =
        input;
      const offset = (page - 1) * limit;

      // ----------------------------------------------------------------------
      // 1. KONDISI WHERE (Kriteria Penyaringan Lapis Pertama)
      // ----------------------------------------------------------------------
      const whereConditions = [];

      // Filter kata kunci pada Title, About, atau Kategori
      if (q && q !== "") {
        const searchTerm = `%${q}%`;
        whereConditions.push(
          or(
            ilike(gigs.title, searchTerm),
            ilike(gigs.about, searchTerm),
            ilike(categories.name, searchTerm),
          ),
        );
      }

      // Filter Kategori (Mendukung Parent Category & Sub-category)
      if (categorySlug && categorySlug !== "") {
        whereConditions.push(
          or(
            eq(categories.slug, categorySlug),
            sql`EXISTS (
              SELECT 1 FROM ${categories} AS parent_cat 
              WHERE parent_cat.id = ${categories.parentId} 
              AND parent_cat.slug = ${categorySlug}
            )`,
          ),
        );
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // ----------------------------------------------------------------------
      // 2. KONDISI HAVING (Filter Berdasarkan Agregasi Paket Harga)
      // ----------------------------------------------------------------------
      const havingConditions = [];
      if (minPrice !== undefined) {
        havingConditions.push(gte(sql`MIN(${gigPackages.price})`, minPrice));
      }
      if (maxPrice !== undefined) {
        havingConditions.push(lte(sql`MIN(${gigPackages.price})`, maxPrice));
      }
      const havingClause =
        havingConditions.length > 0 ? and(...havingConditions) : undefined;

      // ----------------------------------------------------------------------
      // 3. PENGURUTAN DATA (Sorting)
      // ----------------------------------------------------------------------
      let orderByClause;
      switch (sortBy) {
        case "newest":
          orderByClause = desc(gigs.createdAt);
          break;
        case "price_asc":
          orderByClause = asc(sql`MIN(${gigPackages.price})`);
          break;
        case "price_desc":
          orderByClause = desc(sql`MIN(${gigPackages.price})`);
          break;
        case "relevance":
        default:
          orderByClause = desc(gigs.createdAt);
          break;
      }

      // ----------------------------------------------------------------------
      // 4. KUERI UTAMA & HITUNG TOTAL (Parallel Execution)
      // ----------------------------------------------------------------------
      const itemsQuery = db
        .select({
          id: gigs.id,
          title: gigs.title,
          slug: gigs.slug,
          coverImage: gigs.coverImage,
          createdAt: gigs.createdAt,
          seller: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
          startingPrice:
            sql<number>`COALESCE(MIN(${gigPackages.price}), 0)`.mapWith(Number),
        })
        .from(gigs)
        .innerJoin(user, eq(gigs.sellerId, user.id))
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, user.id, categories.id)
        .having(havingClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      const countSubquery = db
        .select({ id: gigs.id })
        .from(gigs)
        .innerJoin(categories, eq(gigs.categoryId, categories.id))
        .leftJoin(gigPackages, eq(gigPackages.gigId, gigs.id))
        .where(whereClause)
        .groupBy(gigs.id, categories.id)
        .having(havingClause)
        .as("count_subquery");

      const [items, totalResult] = await Promise.all([
        itemsQuery,
        db.select({ total: count() }).from(countSubquery),
      ]);

      const total = Number(totalResult[0]?.total ?? 0);

      // ----------------------------------------------------------------------
      // 5. RESPONS TERFORMAT
      // ----------------------------------------------------------------------
      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
