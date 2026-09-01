// src/components/ui/icon-picker.tsx
"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X, Check, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DynamicLucideIcon } from "../CategoryIcon";

// Daftar preset icon populer untuk Marketplace & Kategori
const POPULAR_ICON_GROUPS = [
  {
    category: "Populer",
    icons: [
      "code",
      "palette",
      "shopping-bag",
      "briefcase",
      "terminal",
      "cpu",
      "layers",
      "globe",
      "smartphone",
      "video",
      "camera",
      "music",
      "headphones",
      "database",
      "shield-check",
      "zap",
      "sparkles",
      "wrench",
      "book-open",
      "pen-tool",
    ],
  },
  {
    category: "Tech & Dev",
    icons: [
      "code-2",
      "binary",
      "bug",
      "cloud",
      "git-branch",
      "server",
      "monitor",
      "hard-drive",
      "bot",
      "workflow",
      "key-round",
      "webhook",
    ],
  },
  {
    category: "Design & Media",
    icons: [
      "image",
      "figma",
      "vector",
      "brush",
      "sparkle",
      "pipette",
      "wand-2",
      "film",
      "mic",
      "radio",
      "clapperboard",
    ],
  },
  {
    category: "Bisnis & E-Commerce",
    icons: [
      "store",
      "credit-card",
      "trending-up",
      "bar-chart-3",
      "coins",
      "tag",
      "percent",
      "truck",
      "package",
      "receipt",
    ],
  },
];

interface LucideIconPickerProps {
  value?: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LucideIconPicker({
  value,
  onChange,
  disabled = false,
}: LucideIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("Populer");

  // Filter icon berdasarkan keyword pencarian
  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      const matchedGroup = POPULAR_ICON_GROUPS.find(
        (g) => g.category === activeGroup,
      );
      return matchedGroup ? matchedGroup.icons : POPULAR_ICON_GROUPS[0].icons;
    }

    // Cari dari seluruh kunci ekspor lucide-react jika user mengetik
    const allLucideKeys = Object.keys(LucideIcons).filter(
      (key) =>
        key !== "default" &&
        key !== "createLucideIcon" &&
        typeof (LucideIcons as Record<string, unknown>)[key] === "object",
    );

    return allLucideKeys
      .filter((key) => key.toLowerCase().includes(query))
      .slice(0, 36) // Limit 36 item untuk performa rendering ultra-cepat
      .map((key) => key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase());
  }, [search, activeGroup]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        {/* Trigger Button */}
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="flex-1 justify-between h-10 rounded-xl px-3 border-border/80 hover:bg-accent/40 text-left font-normal"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <DynamicLucideIcon
                    name={value}
                    className="h-4 w-4"
                    fallback={HelpCircle}
                  />
                </div>
                <span className="text-xs truncate font-medium">
                  {value && value.trim() ? (
                    <code className="text-primary font-bold">{value}</code>
                  ) : (
                    <span className="text-muted-foreground">
                      Pilih Icon Lucide...
                    </span>
                  )}
                </span>
              </div>
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60" />
            </Button>
          }
        />

        {/* Clear Button */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => onChange("")}
            className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl shrink-0"
            title="Hapus Icon"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Popover Catalog & Search Container */}
      <PopoverContent
        align="start"
        className="w-[340px] sm:w-[380px] p-3 rounded-2xl shadow-xl border-border/80 space-y-3"
      >
        {/* Search Input Box */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari icon (contoh: code, bag, user...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-muted/40"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips (hanya jika sedang tidak mengetik pencarian) */}
        {!search && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {POPULAR_ICON_GROUPS.map((group) => (
              <button
                key={group.category}
                type="button"
                onClick={() => setActiveGroup(group.category)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer",
                  activeGroup === group.category
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {group.category}
              </button>
            ))}
          </div>
        )}

        {/* Grid Icon Catalog */}
        <div className="grid grid-cols-6 gap-1.5 max-h-[210px] overflow-y-auto p-1 scrollbar-gutter-stable">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((iconName) => {
              const isSelected = value === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  title={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-11 rounded-xl transition-all cursor-pointer border group",
                    isSelected
                      ? "bg-primary/15 border-primary text-primary shadow-xs"
                      : "border-transparent hover:bg-accent hover:border-border/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <DynamicLucideIcon name={iconName} className="h-5 w-5" />
                  {isSelected && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-6 text-center py-6 space-y-1">
              <p className="text-xs text-muted-foreground">
                Icon <code>&quot;{search}&quot;</code> tidak ditemukan di
                preset.
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => {
                  onChange(search.trim().toLowerCase());
                  setOpen(false);
                }}
                className="text-xs text-primary h-auto p-0 font-bold"
              >
                Gunakan nama &quot;{search.trim()}&quot; langsung
              </Button>
            </div>
          )}
        </div>

        {/* Footer info nama icon terpilih */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Terpilih:{" "}
            <strong className="text-foreground font-mono">
              {value || "Folder (Default)"}
            </strong>
          </span>
          {value && (
            <span className="text-primary font-medium flex items-center gap-1">
              <Check className="h-3 w-3" /> Siap digunakan
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
