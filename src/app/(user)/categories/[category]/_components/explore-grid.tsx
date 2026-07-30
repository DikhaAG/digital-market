import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface ExploreGridProps {
  categoryName: string;
  categorySlug: string;
  subcategories: Subcategory[];
}

export function ExploreGrid({
  categoryName,
  categorySlug,
  subcategories,
}: ExploreGridProps) {
  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Jelajahi {categoryName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cari layanan berdasarkan sub-kategori untuk menemukan spesialisasi
            yang Anda butuhkan
          </p>
        </div>
      </div>

      {/* Dynamic Subcategories Grid */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/categories/${categorySlug}/${sub.slug}`}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-foreground/20 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {sub.name}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                <span>Lihat Layanan</span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/30">
          <p className="text-muted-foreground text-sm">
            Belum ada sub-kategori yang tersedia untuk {categoryName}.
          </p>
        </div>
      )}
    </section>
  );
}
