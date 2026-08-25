//src/app/(user)/categories/[category]/[subcategory]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ChevronRight, Sparkles } from "lucide-react";
import { trpcServer } from "@/lib/trpc/server";
import { Badge } from "@/components/ui/badge";
import { GigFiltersToolbar } from "@/components/filters/GigFiltersToolbar";
import { GigCard } from "@/components/gigs/GigCard";

interface SubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
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
}: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug } = await params;
  const trpc = await trpcServer();
  const subcategoryData = await trpc.category.getBySlug({
    slug: subcategorySlug,
  });

  if (!subcategoryData) {
    return { title: "Subcategory Not Found | Fiverr Clone" };
  }

  return {
    title: `${subcategoryData.name} Services | Fiverr Clone`,
    description: `Temukan jasa freelance ${subcategoryData.name} profesional terbaik.`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { category: parentCategorySlug, subcategory: subcategorySlug } =
    await params;
  const { minPrice, maxPrice, sortBy, options, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const attributeOptionIds = options
    ? options.split(",").filter(Boolean)
    : undefined;

  const trpc = await trpcServer();

  const [parentCategory, subcategoryData, gigsResponse] = await Promise.all([
    trpc.category.getBySlug({ slug: parentCategorySlug }),
    trpc.category.getBySlug({ slug: subcategorySlug }),
    trpc.gig.search({
      categorySlug: subcategorySlug,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      attributeOptionIds,
      page: currentPage,
      limit: 12,
    }),
  ]);

  // Validasi Keberadaan dan Induk Kategori
  if (
    !subcategoryData ||
    !parentCategory ||
    subcategoryData.parentId !== parentCategory.id
  ) {
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
        name: parentCategory.name,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${parentCategory.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subcategoryData.name,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${parentCategory.slug}/${subcategoryData.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="subcategory-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-background text-foreground p-6 sm:p-10 border border-primary/15 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                <li>
                  <Link
                    href={`/categories/${parentCategory.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {parentCategory.name}
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                <li
                  className="text-primary font-semibold truncate"
                  aria-current="page"
                >
                  {subcategoryData.name}
                </li>
              </ol>
            </nav>

            <div className="space-y-2">
              <Badge
                variant="outline"
                className="border-primary/25 bg-primary/10 text-primary backdrop-blur-md px-3 py-1 text-xs font-medium gap-1.5 rounded-full"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                Sub-Kategori Spesialis
              </Badge>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                {subcategoryData.name}
              </h1>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <GigFiltersToolbar
            totalResults={pagination.total}
            fixedCategorySlug={subcategorySlug}
            initialCategoryName={`${parentCategory.name} > ${subcategoryData.name}`}
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
              <h4 className="text-base font-bold text-foreground">
                Belum Ada Layanan pada Sub-Kategori Ini
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Coba kembali ke halaman kategori utama atau ubah kriteria
                pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
