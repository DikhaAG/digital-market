"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, Check } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ServiceOptionsFilterPopoverProps {
  categorySlug: string;
  selectedOptionIds: string[];
  isPending: boolean;
  onApply: (optionIds: string[]) => void;
}

export function ServiceOptionsFilterPopover({
  categorySlug,
  selectedOptionIds,
  isPending,
  onApply,
}: ServiceOptionsFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedOptionIds);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalSelectedIds(selectedOptionIds);
    }
    setOpen(nextOpen);
  };

  const { data: attributes, isLoading } =
    trpc.gig.getCategoryAttributes.useQuery(
      { categorySlug },
      { enabled: Boolean(categorySlug) },
    );

  const toggleOption = (id: string) => {
    setLocalSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    onApply(localSelectedIds);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalSelectedIds([]);
    onApply([]);
    setOpen(false);
  };

  const activeCount = selectedOptionIds.length;
  const isCategorySelected = Boolean(
    categorySlug && categorySlug.trim() !== "",
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={!isCategorySelected}
            className={`rounded-xl border-border font-semibold text-sm h-10 px-4 transition-all gap-2 cursor-pointer ${
              activeCount > 0
                ? "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                : "hover:border-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 opacity-70" />
            <span>Service Options</span>
            {activeCount > 0 && (
              <Badge
                variant="default"
                className="h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold justify-center"
              >
                {activeCount}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 opacity-60 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        }
      ></PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[90vw] sm:w-105 p-0 rounded-2xl shadow-xl border-border/80 overflow-hidden"
      >
        <div className="p-4 border-b border-border/60 bg-muted/30 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-foreground">
              Opsi Layanan Kustom
            </h4>
            <p className="text-xs text-muted-foreground">
              Filter berdasarkan preferensi spesifikasi teknis
            </p>
          </div>
          {localSelectedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalSelectedIds([])}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="p-4 max-h-90 overflow-y-auto space-y-5 scrollbar-thin">
          {!isCategorySelected ? (
            <div className="text-center py-6 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                Pilih kategori terlebih dahulu
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                Filter opsi layanan disesuaikan dengan jenis kategori yang
                aktif.
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : attributes && attributes.length > 0 ? (
            attributes.map((attr) => (
              <div key={attr.id} className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                  {attr.name}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attr.options.map((opt) => {
                    const isChecked = localSelectedIds.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          isChecked
                            ? "border-primary bg-primary/5 text-foreground font-semibold shadow-2xs"
                            : "border-border/60 bg-card hover:bg-accent/50 text-muted-foreground"
                        }`}
                      >
                        <Checkbox
                          id={`opt-${opt.id}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleOption(opt.id)}
                          className="h-4 w-4 rounded-md pointer-events-none"
                        />
                        <label
                          htmlFor={`opt-${opt.id}`}
                          className="truncate cursor-pointer select-none"
                        >
                          {opt.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground italic">
              Tidak ada opsi filter kustom untuk kategori ini.
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={selectedOptionIds.length === 0}
            className="h-9 rounded-xl text-xs font-semibold"
          >
            Hapus Semua
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={isPending || !isCategorySelected}
            className="h-9 px-5 rounded-xl text-xs font-bold gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Terapkan Filter</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
