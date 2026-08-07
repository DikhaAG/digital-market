"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import type { SuggestionItemProps } from "./search-bar.types";

export function SuggestionItem({ gig, onSelect }: SuggestionItemProps) {
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
