import type { Metadata } from "next";
import { trpcServer } from "@/lib/trpc/server";
import { GigCard } from "@/components/gigs/GigCard";
import { SearchHeader } from "./_components/SearchHeader";
import { SearchEmptyState } from "./_components/SearchEmptySearch";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
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
  const { q, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const trpc = await trpcServer();
  const { items, pagination } = await trpc.gig.search({
    q,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SearchHeader query={q} totalResults={pagination.total} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <GigCard
              key={item.id}
              gig={{ ...item, createdAt: item.createdAt.toISOString() }}
            />
          ))}
        </div>
      ) : (
        <SearchEmptyState query={q} />
      )}
    </div>
  );
}
