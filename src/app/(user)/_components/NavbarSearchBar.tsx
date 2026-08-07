"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight, Tag } from "lucide-react";
import { cva } from "class-variance-authority";
import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

// ==========================================
// 1. STYLES WITH CLASS VARIANCE AUTHORITY (CVA)
// ==========================================
const searchContainerVariants = cva("w-full transition-all flex items-center", {
  variants: {
    variant: {
      mobile: "relative w-full",
      desktop:
        "border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

const inputVariants = cva("w-full text-sm bg-transparent", {
  variants: {
    variant: {
      mobile:
        "h-10 border-input bg-background rounded-md pl-3 pr-16 focus-visible:ring-1 focus-visible:ring-ring",
      desktop:
        "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 px-4 pr-8",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

const searchButtonVariants = cva(
  "cursor-pointer text-primary-foreground hover:bg-primary/90 bg-primary shrink-0 flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        mobile: "absolute right-1 h-8 w-8 rounded-md",
        desktop: "rounded-lg h-10 w-12 border",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);

// ==========================================
// 2. TYPES
// ==========================================
type SearchVariant = "desktop" | "mobile";

interface NavbarSearchBarProps {
  placeholder?: string;
  variant?: SearchVariant;
  className?: string;
}

interface GigSuggestion {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  startingPrice: number;
  category: { name: string };
}

// ==========================================
// 3. CUSTOM HOOKS
// ==========================================
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

// ==========================================
// 4. SUB-COMPONENTS
// ==========================================
interface SuggestionItemProps {
  gig: GigSuggestion;
  onSelect: () => void;
}

function SuggestionItem({ gig, onSelect }: SuggestionItemProps) {
  return (
    <Link
      href={`/gigs/${gig.slug}`}
      onClick={onSelect}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/70 transition-colors group"
    >
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
          <span className="font-semibold text-foreground">
            Mulai ${gig.startingPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}

interface SearchPopoverProps {
  isLoading: boolean;
  suggestions: GigSuggestion[];
  debouncedQuery: string;
  onClose: () => void;
  onSubmit: () => void;
}

function SearchPopover({
  isLoading,
  suggestions,
  debouncedQuery,
  onClose,
  onSubmit,
}: SearchPopoverProps) {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in-50 slide-in-from-top-2 duration-150">
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
              <SuggestionItem key={gig.id} gig={gig} onSelect={onClose} />
            ))}
          </div>

          <button
            type="button"
            onClick={onSubmit}
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
  );
}

// ==========================================
// 5. MAIN COMPONENT
// ==========================================
export function NavbarSearchBar({
  placeholder = "What service are you looking for today?",
  variant = "desktop",
  className,
}: NavbarSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);

  // Debouncing State (Menggunakan library use-debounce)
  const debouncedQuery = useDebounce(query.trim(), 300) ?? "";

  // Sync state dengan URL perubahan parameter
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Handle klik di luar container
  useClickOutside(containerRef, () => setIsOpen(false));

  // Fetch Live Suggestions
  const { data, isLoading } = trpc.gig.search.useQuery(
    { q: debouncedQuery, limit: 5 },
    {
      enabled: (debouncedQuery?.length ?? 0) >= 2 && isOpen,
      staleTime: 1000 * 60,
    },
  );

  const suggestions = data?.items ?? [];

  // Submit Handler
  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      setIsOpen(false);

      const trimmed = query.trim();
      const targetUrl = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";

      startTransition(() => {
        router.push(targetUrl);
      });
    },
    [query, router],
  );

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const currentPlaceholder =
    variant === "mobile" ? "Temukan Layanan..." : placeholder;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className={searchContainerVariants({ variant })}>
          <div className="relative flex-1 flex items-center">
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={currentPlaceholder}
              className={inputVariants({ variant })}
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 text-muted-foreground hover:text-foreground p-1 cursor-pointer transition-colors"
                title="Hapus teks"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={isPending}
            className={searchButtonVariants({ variant })}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Live Suggestions Popover */}
      {isOpen && debouncedQuery.length >= 2 && (
        <SearchPopover
          isLoading={isLoading}
          suggestions={suggestions}
          debouncedQuery={debouncedQuery}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSearchSubmit}
        />
      )}
    </div>
  );
}
