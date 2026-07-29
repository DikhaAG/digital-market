import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ExploreGridItem } from "../data/category";

interface ExploreGridProps {
  categoryName: string;
  categorySlug: string;
  gridData: ExploreGridItem[];
}

export function ExploreGrid({
  categoryName,
  categorySlug,
  gridData,
}: ExploreGridProps) {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Jelajahi {categoryName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Cari layanan berdasarkan sub kategori untuk menemukan tepat yang
            anda butuhkan
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {gridData.map((card, idx) => (
          <div key={idx} className="group flex flex-col space-y-4">
            {/* 1. Header Image Banner (Presisi Referensi Gambar) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-md">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>

            {/* 2. Card Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight px-1">
              {card.title}
            </h3>

            {/* 3. Sub-links List */}
            <ul className="space-y-1.5" role="list">
              {card.items.map((item, itemIdx) => {
                const itemName = typeof item === "string" ? item : item.name;
                const isNew = typeof item === "object" && item.isNew;
                const subSlug = itemName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-");

                return (
                  <li key={itemIdx}>
                    <Link
                      href={`/categories/${categorySlug}/${subSlug}`}
                      className="group/item flex items-center justify-between rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-medium text-foreground/80 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-all"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="truncate">{itemName}</span>
                        {/* Pink Tag Badge NEW */}
                        {isNew && (
                          <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 shrink-0">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Panah Kanan (Tampil Saat Hover/Active) */}
                      <ArrowRight className="h-5 w-5 text-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
