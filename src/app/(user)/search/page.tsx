// src/app/(user)/search/page.tsx
import { trpcServer } from "@/lib/trpc/server";
import { GigCard } from "@/components/gigs/GigCard";
import { SearchEmptyState } from "@/components/filters/SearchEmptySearch";
import { GigFiltersToolbar } from "@/components/filters/GigFiltersToolbar";
import { SearchHeader } from "@/components/filters/SearchHeader";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    categorySlug?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "relevance" | "newest" | "price_asc" | "price_desc";
    options?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categorySlug, minPrice, maxPrice, sortBy, options, page } =
    await searchParams;
  const currentPage = Number(page) || 1;

  const formattedCategorySlug =
    categorySlug && categorySlug.trim() !== ""
      ? categorySlug.trim()
      : undefined;

  const attributeOptionIds = options
    ? options.split(",").filter(Boolean)
    : undefined;

  const trpc = await trpcServer();
  const { items, pagination } = await trpc.gig.search({
    q,
    categorySlug: formattedCategorySlug,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    attributeOptionIds,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <SearchHeader query={q} />
      <GigFiltersToolbar totalResults={pagination.total} variant="search" />

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
