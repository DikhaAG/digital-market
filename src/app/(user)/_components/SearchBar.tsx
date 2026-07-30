"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

interface SearchBarProps {
  placeholder?: string;
  variant?: "desktop" | "mobile";
}

export function SearchBar({
  placeholder = "What service are you looking for today?",
  variant = "desktop",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // Read 'q' dari URL query param
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);

  // Sync input value saat URL query param berubah
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounce logic untuk live autocomplete (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle klik di luar container untuk menutup Popover Autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Live Suggestions via tRPC
  const { data, isLoading } = trpc.gig.search.useQuery(
    { q: debouncedQuery, limit: 5 },
    {
      enabled: debouncedQuery.length >= 2 && isOpen,
      staleTime: 1000 * 60,
    },
  );

  const suggestions = data?.items ?? [];

  // ✅ FIXED: Menentukan HTMLFormElement pada FormEvent
  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="w-full">
        {variant === "mobile" ? (
          /* ================= MOBILE VARIANT ================= */
          <div className="relative flex items-center w-full">
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Temukan Layanan..."
              className="w-full h-10 border-input bg-background rounded-md pl-3 pr-16 text-sm focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="absolute right-1 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* ================= DESKTOP VARIANT ================= */
          <div className="flex items-center w-full border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring transition-all">
            <div className="relative flex-1 flex items-center">
              <Input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 px-4 text-sm bg-transparent w-full pr-8"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              size="icon"
              className="rounded-none h-10 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </form>

      {/* ================= AUTOCOMPLETE LIVE PREVIEW POPOVER ================= */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden text-left">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Mencari layanan...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-border/50">
              <div className="p-2 space-y-1">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rekomendasi Layanan
                </p>
                {suggestions.map((gig) => (
                  <Link
                    key={gig.id}
                    href={`/gigs/${gig.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/70 transition-colors group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-11 w-14 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                      {gig.coverImage ? (
                        <Image
                          src={gig.coverImage}
                          alt={gig.title}
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Info Gig */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {gig.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Tag className="h-3 w-3 text-primary/70" />
                          {gig.category.name}
                        </span>
                        <span>•</span>
                        {/* ✅ FIXED: Terdeteksi sempurna tanpa TypeScript Error */}
                        <span className="font-semibold text-foreground">
                          Mulai ${gig.startingPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Search Results Footer */}
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="w-full p-3 bg-muted/30 hover:bg-muted text-xs font-semibold text-primary flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Lihat semua hasil untuk "{debouncedQuery}"</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">
                Tidak ada layanan ditemukan
              </p>
              <p className="text-xs">
                Coba gunakan kata kunci lain untuk "{debouncedQuery}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
