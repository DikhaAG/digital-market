// src/app/(user)/_components/HeroSearchBar.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  X,
  Loader2,
  ArrowRight,
  Tag,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

// ==========================================
// 1. TYPES
// ==========================================
interface SearchFormValues {
  q: string;
}

interface HeroSearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  onSearch?: (query: string) => void;
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
// 2. CUSTOM HOOKS
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

function useAutoResizeTextarea(value: string, maxHeight = 180) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, maxHeight]);

  return textareaRef;
}

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================
interface HeroSearchActionsProps {
  query: string;
  isPending: boolean;
  onClear: () => void;
  onSubmit: () => void;
}

function HeroSearchActions({
  query,
  isPending,
  onClear,
  onSubmit,
}: HeroSearchActionsProps) {
  const isQueryValid = Boolean(query.trim());

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          title="Hapus teks"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Shortcut Indicator */}
      <span className="text-[11px] text-muted-foreground/60 hidden sm:inline-block select-none">
        <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/50 font-mono text-[10px]">
          ↵ Enter
        </kbd>
      </span>

      {/* Submit Action Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isQueryValid || isPending}
        className={cn(
          "p-2.5 rounded-full transition-all duration-200 shrink-0 flex items-center justify-center",
          isQueryValid && !isPending
            ? "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-md shadow-primary/25 cursor-pointer"
            : "bg-muted text-muted-foreground/40 cursor-not-allowed",
        )}
        title="Kirim pencarian"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
        ) : (
          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
}

/**
 * Dynamic Suggestion Chips Berdasarkan Data Gig (Database-Driven)
 */
interface SuggestionChipsProps {
  onSelectChip: (title: string) => void;
}

function SuggestionChips({ onSelectChip }: SuggestionChipsProps) {
  // Fetch 6 Gig relevan/terbaru langsung dari database via tRPC
  const { data, isLoading } = trpc.gig.search.useQuery(
    { limit: 6, sortBy: "relevance" },
    {
      staleTime: 1000 * 60 * 5, // Cache 5 menit
      refetchOnWindowFocus: false,
    },
  );

  const gigs = data?.items ?? [];

  // Skeleton Loading State (Pill Shape) untuk Zero Cumulative Layout Shift (CLS)
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5 relative z-10">
        <span className="text-xs font-medium text-muted-foreground/80 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Populer:
        </span>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 w-28 rounded-full bg-muted/60 shrink-0"
          />
        ))}
      </div>
    );
  }

  if (gigs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5 relative z-10">
      <span className="text-xs font-medium text-muted-foreground/80 shrink-0 flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary" /> Populer:
      </span>
      {gigs.map((gig) => (
        <button
          key={gig.id}
          type="button"
          onClick={() => onSelectChip(gig.title)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 max-w-[220px]",
            "bg-card/60 hover:bg-card border border-border/60 hover:border-primary/40 text-foreground/80 hover:text-foreground",
            "transition-all duration-200 hover:shadow-xs active:scale-95 cursor-pointer group",
          )}
          title={gig.title}
        >
          <Briefcase className="h-3 w-3 text-primary/80 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">{gig.title}</span>
        </button>
      ))}
    </div>
  );
}

interface SearchSuggestionsPopoverProps {
  isLoading: boolean;
  suggestions: GigSuggestion[];
  debouncedQuery: string;
  onSelectSuggestion: () => void;
  onSubmitSearch: () => void;
}

function SearchSuggestionsPopover({
  isLoading,
  suggestions,
  debouncedQuery,
  onSelectSuggestion,
  onSubmitSearch,
}: SearchSuggestionsPopoverProps) {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in-50 slide-in-from-top-2 duration-200">
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
                onClick={onSelectSuggestion}
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
            ))}
          </div>

          <button
            type="button"
            onClick={onSubmitSearch}
            className="w-full p-3 bg-muted/30 hover:bg-muted text-xs font-semibold text-primary flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Lihat semua hasil untuk &quot;{debouncedQuery}&quot;</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="p-6 text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">
            Tidak ada layanan ditemukan
          </p>
          <p className="text-xs">
            Coba gunakan kata kunci lain untuk &quot;{debouncedQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. MAIN SEARCHBAR COMPONENT
// ==========================================
export function HeroSearchBar({
  placeholder = "Tanyakan atau cari layanan/produk digital...",
  defaultValue = "",
  className,
  onSearch,
}: HeroSearchBarProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Inisialisasi React Hook Form
  const { register, handleSubmit, setValue, control } =
    useForm<SearchFormValues>({
      defaultValues: {
        q: defaultValue,
      },
    });

  // 2. Monitoring query menggunakan useWatch & useDebounce
  const queryValue = useWatch({ control, name: "q" }) ?? "";
  const debouncedQuery = useDebounce(queryValue.trim(), 300) ?? "";

  // 3. Custom Hook Auto-Resize Textarea & Click Outside
  const textareaRef = useAutoResizeTextarea(queryValue);
  useClickOutside(containerRef, () => setIsOpen(false));

  // 4. Fetch Live Suggestions via tRPC Query
  const { data, isLoading } = trpc.gig.search.useQuery(
    { q: debouncedQuery, limit: 5 },
    {
      enabled: (debouncedQuery?.length ?? 0) >= 2 && isOpen,
      staleTime: 1000 * 60,
    },
  );

  const suggestions = data?.items ?? [];

  // 5. Submit Handler
  const onSubmit = useCallback(
    (values: SearchFormValues) => {
      setIsOpen(false);
      const trimmed = values.q.trim();

      if (onSearch) {
        onSearch(trimmed);
        return;
      }

      const targetUrl = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";

      startTransition(() => {
        router.push(targetUrl);
      });
    },
    [onSearch, router],
  );

  // Keyboard Navigation: Enter (Tanpa Shift) memicu submit form
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Click Suggestion Chip Handler
  const handleChipClick = (title: string) => {
    setValue("q", title);
    setIsOpen(true);
    textareaRef.current?.focus();
  };

  // Clear Input Handler
  const handleClear = () => {
    setValue("q", "");
    setIsOpen(false);
  };

  // Merging RHF Ref & Local Textarea Ref
  const { ref: registerRef, ...registerProps } = register("q", {
    onChange: () => setIsOpen(true),
  });

  return (
    <div
      ref={containerRef}
      className={cn("w-full space-y-3 relative z-30", className)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Single-Row Input Container */}
        <div
          className={cn(
            "relative w-full rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-lg transition-all duration-300 z-20",
            "hover:border-primary/40 hover:shadow-xl",
            isFocused &&
              "border-primary/80 ring-2 ring-primary/20 bg-card shadow-2xl shadow-primary/5",
          )}
        >
          <div className="flex items-center gap-2 p-2 pl-4 sm:p-2.5 sm:pl-5">
            {/* Textarea Input dengan Merged Refs */}
            <textarea
              ref={(e) => {
                registerRef(e);
                textareaRef.current = e;
              }}
              {...registerProps}
              rows={1}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                setIsOpen(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={cn(
                "w-full resize-none bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70",
                "focus:outline-none min-h-[28px] max-h-[180px] py-1 font-sans leading-relaxed",
              )}
            />

            {/* Action Control Group */}
            <HeroSearchActions
              query={queryValue}
              isPending={isPending}
              onClear={handleClear}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </form>

      {/* Popover Live Suggestions */}
      {isOpen && (debouncedQuery?.length ?? 0) >= 2 && (
        <SearchSuggestionsPopover
          isLoading={isLoading}
          suggestions={suggestions}
          debouncedQuery={debouncedQuery}
          onSelectSuggestion={() => setIsOpen(false)}
          onSubmitSearch={handleSubmit(onSubmit)}
        />
      )}

      {/* Dynamic Gig Suggestion Chips */}
      <SuggestionChips onSelectChip={handleChipClick} />
    </div>
  );
}
