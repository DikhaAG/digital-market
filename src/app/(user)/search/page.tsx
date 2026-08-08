import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { trpcServer } from "@/lib/trpc/server";

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

  // FIX 1: Panggil & await trpcServer() untuk mendapatkan instansi caller
  const trpc = await trpcServer();
  const { items, pagination } = await trpc.gig.search({
    q,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-4 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {q ? (
            <span>
              Hasil pencarian untuk <span className="text-primary">"{q}"</span>
            </span>
          ) : (
            "Semua Layanan Freelance"
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ditemukan {pagination.total} layanan terverifikasi
        </p>
      </div>

      {/* Grid Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((gig) => (
            <Link
              key={gig.id}
              href={`/gigs/${gig.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* FIX 2: Diubah menjadi aspect-16/10 sesuai Tailwind v4 */}
              <div className="relative aspect-16/10 w-full bg-muted">
                {gig.coverImage && (
                  <Image
                    src={gig.coverImage}
                    alt={gig.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {gig.category.name}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {gig.title}
                  </h3>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mulai dari</span>
                  <span className="font-bold text-foreground text-sm">
                    ${gig.startingPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/30">
          <p className="text-muted-foreground text-sm">
            Tidak ada layanan yang sesuai dengan kata kunci "{q}".
          </p>
        </div>
      )}
    </div>
  );
}
