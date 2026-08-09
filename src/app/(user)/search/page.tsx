import type { Metadata } from "next";
import { trpcServer } from "@/lib/trpc/server";
import { GigCard } from "@/components/gigs/GigCard";
import { SearchHeader } from "./_components/SearchHeader";
import { SearchFilters } from "./_components/SearchFilters";
import { SearchEmptyState } from "./_components/SearchEmptySearch";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    categorySlug?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "relevance" | "newest" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil Pencarian untuk "${q}" | Fiverr Clone` : "Cari Layanan",
    description: "Temukan jasa freelance terbaik untuk kebutuhan proyek Anda.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categorySlug, minPrice, maxPrice, sortBy, page } =
    await searchParams;
  const currentPage = Number(page) || 1;

  const formattedCategorySlug =
    categorySlug && categorySlug.trim() !== ""
      ? categorySlug.trim()
      : undefined;
  // Best Approach: Query data via tRPC Server Caller
  const trpc = await trpcServer();
  const { items, pagination } = await trpc.gig.search({
    q,
    categorySlug: formattedCategorySlug,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Title & Header */}
      <SearchHeader query={q} />

      {/* Fiverr-Style Filter Toolbar & Sorting */}
      <SearchFilters totalResults={pagination.total} />

      {/* Grid Item Hasil Pencarian */}
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
        <SearchEmptyState query={q} />
      )}
    </div>
  );
}
