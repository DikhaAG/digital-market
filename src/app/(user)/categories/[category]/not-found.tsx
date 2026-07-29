"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  Home,
  Compass,
  Sparkles,
  ArrowRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/features/user/layout/nav/data/categories";

export default function CategoryNotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mengambil 6 kategori aktif pertama sebagai rekomendasi opsi pengganti
  const activeCategories = CATEGORIES.slice(0, 6);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const slug = searchQuery
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      router.push(`/search?q=${slug}`);
    }
  };

  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center space-y-8 py-12 px-4 text-center">
      {/* ================= 1. VISUAL BADGE & AMBIENT GLOW ================= */}
      <div className="relative flex items-center justify-center">
        {/* Glow Background Effect (Menggunakan Token Visual Hero) */}
        <div className="absolute h-64 w-64 rounded-full bg-brand/15 blur-3xl pointer-events-none" />

        <div className="relative rounded-3xl border border-brand/20 bg-card/80 backdrop-blur-xl p-6 shadow-2xl">
          <div className="rounded-2xl bg-brand/10 p-4 text-brand border border-brand/20">
            <FileQuestion className="h-12 w-12 sm:h-16 sm:w-16 animate-bounce/10" />
          </div>
        </div>
      </div>

      {/* ================= 2. HEADINGS & ERROR TEXT ================= */}
      <div className="max-w-md space-y-3">
        <Badge
          variant="outline"
          className="border-brand/30 bg-brand/10 text-brand backdrop-blur-md px-3.5 py-1 text-xs font-semibold gap-1.5 rounded-full inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          404 - Category Not Found
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Category Doesn't Exist
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          The service category you are looking for might have been renamed,
          removed, or the link was typed incorrectly.
        </p>
      </div>

      {/* ================= 3. DIRECT RECOVERY SEARCH BAR ================= */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center max-w-md w-full shadow-sm"
      >
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for services or keywords..."
          className="w-full rounded-xl border border-input bg-card pl-10 pr-24 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground hover:bg-brand/90 transition-all active:scale-95"
        >
          Search
        </button>
      </form>

      {/* ================= 4. PRIMARY ACTION BUTTONS ================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>

        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground px-5 py-2.5 text-sm font-semibold transition-all shadow-sm active:scale-95"
        >
          <Compass className="h-4 w-4 text-muted-foreground" />
          Explore All Categories
        </Link>
      </div>

      {/* ================= 5. SUGGESTED ACTIVE CATEGORIES ================= */}
      {activeCategories.length > 0 && (
        <div className="w-full max-w-2xl pt-8 border-t border-border space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Search className="h-3.5 w-3.5" />
            <span>Or explore these popular categories</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {activeCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:border-brand/80 hover:bg-brand/5 hover:text-brand transition-all shadow-sm hover:-translate-y-0.5"
              >
                <span>{cat.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
