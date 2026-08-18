"use client";

import Link from "next/link";
import { Search, FolderX, ArrowLeft, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const POPULAR_RECOMMENDATIONS = [
  { name: "Web Development", slug: "web-development" },
  { name: "Logo Design", slug: "logo-design" },
  { name: "Video Editing", slug: "video-editing" },
  { name: "Digital Marketing", slug: "digital-marketing" },
];

export default function CategoryNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl border border-border/80 bg-card/60 shadow-xl backdrop-blur-xs">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-2xs">
          <FolderX className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Kategori Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Maaf, kategori layanan yang Anda cari tidak dapat ditemukan atau
            mungkin telah dihapus.
          </p>
        </div>

        <div className="pt-2">
          <Button
            nativeButton={false}
            render={
              <Link href="/search">
                <Search className="h-4 w-4" />
                <span>Cari Semua Layanan</span>
              </Link>
            }
            variant="default"
            size="lg"
            className="rounded-2xl font-bold h-11 px-6 gap-2 cursor-pointer shadow-md"
          ></Button>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/40">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Kategori Populer Lainnya</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_RECOMMENDATIONS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="text-xs px-3 py-1.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted text-foreground font-semibold transition-all hover:border-primary/40"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 pt-2 text-xs font-semibold text-muted-foreground">
          <Link
            href="/categories"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Daftar Kategori</span>
          </Link>
          <span>•</span>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
