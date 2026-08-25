//src/components/filters/SortBySelect.tsx
"use client";

import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SORT_OPTIONS = [
  {
    value: "relevance",
    label: "Relevansi Utama",
    icon: Sparkles,
  },
  {
    value: "newest",
    label: "Terbaru Dipublikasi",
    icon: Clock,
  },
  {
    value: "price_asc",
    label: "Harga: Rendah ke Tinggi",
    icon: ArrowUpNarrowWide,
  },
  {
    value: "price_desc",
    label: "Harga: Tinggi ke Rendah",
    icon: ArrowDownWideNarrow,
  },
] as const;

export interface SortBySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean; // 👈 Menambahkan properti disabled (Memperbaiki Error 2322)
}

export function SortBySelect({ value, onChange, disabled }: SortBySelectProps) {
  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === value) ?? SORT_OPTIONS[0];
  const ActiveIcon = selectedOption.icon;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
        Urutkan:
      </span>
      <Select
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
        disabled={disabled} // 👈 Meneruskan status disabled
      >
        <SelectTrigger
          aria-label="Urutkan hasil pencarian"
          className="h-9 w-auto min-w-36 sm:min-w-44 rounded-xl border-border/80 bg-card/60 px-3 text-xs font-bold text-foreground hover:bg-accent/50 focus:ring-1 focus:ring-primary shadow-2xs transition-all cursor-pointer gap-2"
        >
          <div className="flex items-center gap-2 truncate">
            <ActiveIcon className="h-3.5 w-3.5 text-primary shrink-0" />
            <SelectValue placeholder="Urutkan Berdasarkan" />
          </div>
        </SelectTrigger>

        <SelectContent
          align="end"
          className="w-52 p-1 rounded-2xl shadow-xl border-border/80 z-60"
        >
          <SelectGroup>
            <SelectLabel className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              Kriteria Urutan
            </SelectLabel>
            {SORT_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              return (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs font-semibold rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <OptIcon className="h-3.5 w-3.5 opacity-70 shrink-0" />
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
