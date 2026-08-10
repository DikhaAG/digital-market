"use client";

import Link from "next/link";
import { FileQuestion, Home, Sparkles, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

export default function CategoryNotFound() {
  // Ambil 6 kategori aktif dari database via tRPC untuk rekomendasi
  const { data: categories, isLoading } =
    trpc.category.getAllWithSubcategories.useQuery(undefined, {
      staleTime: 1000 * 60 * 10, // Cache selama 10 menit
    });

  const popularCategories = categories?.slice(0, 6) ?? [];

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center space-y-8 py-12 px-4 text-center">
      {/* ================= 1. VISUAL BADGE & AMBIENT GLOW ================= */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow Effect */}
        <div className="absolute h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-xl p-6 shadow-xl">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary border border-primary/20">
            <FileQuestion className="h-12 w-12 sm:h-16 sm:w-16 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ================= 2. HEADINGS & ERROR TEXT ================= */}
      <div className="max-w-md space-y-3">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 text-primary backdrop-blur-md px-3.5 py-1 text-xs font-semibold gap-1.5 rounded-full inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          404 - Category Not Found
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Category Doesn&apost; Exist
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          The service category you are looking for might have been renamed,
          removed, or the link was typed incorrectly.
        </p>
      </div>

      {/* ================= 3. PRIMARY ACTION BUTTONS ================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* Base UI Render Prop Pattern */}
        <Button
          nativeButton={false}
          render={
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          }
          size="lg"
          className="rounded-xl gap-2 font-semibold shadow-md"
        />
      </div>

      {/* ================= 4. SUGGESTED ACTIVE CATEGORIES ================= */}
      <div className="w-full max-w-2xl pt-8 border-t border-border space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Search className="h-3.5 w-3.5" />
          <span>Or explore these popular categories</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {/* Skeleton Loader saat data tRPC diproses */}
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))
            : popularCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link href={`/categories/${category.slug}`}>
                      <span>{category.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-60" />
                    </Link>
                  }
                  className="rounded-full hover:border-primary hover:text-primary transition-all gap-1.5"
                />
              ))}
        </div>
      </div>
    </div>
  );
}
