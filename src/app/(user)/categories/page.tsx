// src/app/(user)/categories/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { trpcServer } from "@/lib/trpc/server";
import { SettingsService } from "@/server/services/settings.service";

// ✅ Paksa rute categories menjadi Dynamic (SSR) saat build
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await SettingsService.getSiteMetadataCached();

  return {
    title: "Jelajahi Semua Kategori",
    description: `Temukan berbagai kategori layanan freelance digital terbaik di ${siteMeta.siteTitle}.`,
    openGraph: {
      title: `Jelajahi Semua Kategori | ${siteMeta.siteTitle}`,
      description: `Temukan berbagai kategori layanan freelance digital terbaik di ${siteMeta.siteTitle}.`,
    },
  };
}

export default async function CategoriesIndexPage() {
  const trpc = await trpcServer();
  const categories = await trpc.category.getAllWithSubcategories();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Semua Kategori Layanan
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih kategori spesialisasi untuk mencari talenta profesional yang
          sesuai dengan proyek Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xs hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <Link
                href={`/categories/${category.slug}`}
                className="flex items-center gap-2.5 group"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
              </Link>
              <Link
                href={`/categories/${category.slug}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/categories/${category.slug}/${sub.slug}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
