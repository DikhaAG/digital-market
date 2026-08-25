//src/app/(user)/categories/[category]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { trpcServer } from "@/lib/trpc/server";
import { ExploreGrid } from "./_components/explore-grid";
import { GigFiltersToolbar } from "@/components/filters/GigFiltersToolbar";
import { GigCard } from "@/components/gigs/GigCard";
import { CategoryBreadcrumbs } from "@/components/navigations/CategoryBreadcrumbs";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "relevance" | "newest" | "price_asc" | "price_desc";
    options?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const trpc = await trpcServer();
  const categoryData = await trpc.category.getBySlug({ slug: categorySlug });

  if (!categoryData || categoryData.parentId !== null) {
    return { title: "Category Not Found | Freelance Marketplace" };
  }

  return {
    title: `${categoryData.name} Services | Freelance Marketplace`,
    description: `Temukan talenta freelance terbaik di bidang ${categoryData.name}. Kerjakan proyek Anda bersama profesional terverifikasi.`,
    openGraph: {
      title: `${categoryData.name} Services | Freelance Marketplace`,
      description: `Temukan talenta freelance terbaik di bidang ${categoryData.name}.`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { minPrice, maxPrice, sortBy, options, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const attributeOptionIds = options
    ? options.split(",").filter(Boolean)
    : undefined;

  const trpc = await trpcServer();

  const [categoryData, gigsResponse] = await Promise.all([
    trpc.category.getBySlug({ slug: categorySlug }),
    trpc.gig.search({
      categorySlug,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      attributeOptionIds,
      page: currentPage,
      limit: 12,
    }),
  ]);

  if (!categoryData || categoryData.parentId !== null) {
    notFound();
  }

  const { items, pagination } = gigsResponse;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryData.name,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${categoryData.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Minimal Contextual Header (Hanya Breadcrumbs & Judul Kategori) */}
        <div className="space-y-3 pt-2">
          <CategoryBreadcrumbs items={[{ label: categoryData.name }]} />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {categoryData.name}
          </h1>
        </div>

        {/* Sub-Kategori Explore Grid */}
        <ExploreGrid
          categoryName={categoryData.name}
          categorySlug={categoryData.slug}
          subcategories={categoryData.subcategories ?? []}
        />

        {/* Section Katalog Layanan & Filter Toolbar */}
        <section className="space-y-6 pt-4 border-t border-border/60">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Semua Layanan di {categoryData.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gunakan filter di bawah untuk menemukan spesifikasi layanan yang
              tepat
            </p>
          </div>

          <GigFiltersToolbar
            totalResults={pagination.total}
            fixedCategorySlug={categorySlug}
            showCategoryChip={false}
          />

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {items.map((item) => (
                <GigCard
                  key={item.id}
                  gig={{
                    ...item,
                    createdAt: item.createdAt.toISOString(),
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 my-6">
              <h3 className="text-base font-bold text-foreground">
                Belum Ada Layanan Tersedia
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Coba sesuaikan filter atau rentang budget Anda untuk melihat
                hasil lainnya.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
