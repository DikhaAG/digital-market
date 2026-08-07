"use client";

import { useEffect, useRef, useTransition, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

import { useClickOutside } from "./use-click-outside";
import { SearchPopover } from "./SearchPopover";
import {
  searchContainerVariants,
  inputVariants,
  searchButtonVariants,
} from "./search-bar.variants";
import type {
  NavbarSearchBarProps,
  SearchFormValues,
} from "./search-bar.types";

export function NavbarSearchBar({
  placeholder = "What service are you looking for today?",
  variant = "desktop",
  className,
}: NavbarSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const urlQuery = searchParams.get("q") ?? "";

  // 1. Inisialisasi React Hook Form
  const { register, handleSubmit, setValue, control } =
    useForm<SearchFormValues>({
      defaultValues: { q: urlQuery },
    });

  // 2. Monitoring perubahan input & debounce
  const queryValue = useWatch({ control, name: "q" }) ?? "";
  const debouncedQuery = useDebounce(queryValue.trim(), 300) ?? "";

  // 3. Sync State dengan Parameter URL
  useEffect(() => {
    setValue("q", urlQuery);
  }, [urlQuery, setValue]);

  useClickOutside(containerRef, () => setIsOpen(false));

  // 4. Fetch Live Suggestions
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
      const targetUrl = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";

      startTransition(() => {
        router.push(targetUrl);
      });
    },
    [router],
  );

  const handleClear = () => {
    setValue("q", "");
    setIsOpen(false);
  };

  const currentPlaceholder =
    variant === "mobile" ? "Temukan Layanan..." : placeholder;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Unified Input Container */}
        <div className={searchContainerVariants({ variant })}>
          <Input
            type="text"
            {...register("q", {
              onChange: () => setIsOpen(true),
            })}
            onFocus={() => setIsOpen(true)}
            placeholder={currentPlaceholder}
            className={inputVariants({ variant })}
          />

          {/* Action Toolbar di dalam Input (Kanan) */}
          <div className="absolute right-1.5 flex items-center gap-1 z-10">
            {/* Clear Button */}
            {Boolean(queryValue) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                title="Hapus teks"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Inset Search Button */}
            <Button
              type="submit"
              size="icon"
              disabled={isPending}
              className={searchButtonVariants({ variant })}
              title="Cari"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5 stroke-[2.5]" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Live Suggestions Popover */}
      {isOpen && (debouncedQuery?.length ?? 0) >= 2 && (
        <SearchPopover
          isLoading={isLoading}
          suggestions={suggestions}
          debouncedQuery={debouncedQuery}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    </div>
  );
}
