"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortBySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortBySelect({ value, onChange }: SortBySelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span>Sort by:</span>
      <Select
        value={value}
        onValueChange={(val) => {
          if (val) {
            onChange(val);
          }
        }}
      >
        <SelectTrigger className="w-35 border-none shadow-none font-bold text-foreground focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
