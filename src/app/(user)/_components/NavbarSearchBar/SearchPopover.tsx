"use client";

import { Loader2, ArrowRight } from "lucide-react";
import { SuggestionItem } from "./SuggestionItem";
import type { SearchPopoverProps } from "./search-bar.types";

export function SearchPopover({
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
