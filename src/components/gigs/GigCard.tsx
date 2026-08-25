//src/components/gigs/GigCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";

// Ekstrak tipe data item secara otomatis dari output router tRPC
type RouterOutputs = inferRouterOutputs<AppRouter>;
export type GigItem = RouterOutputs["gig"]["search"]["items"][number];

interface GigCardProps {
  gig: GigItem;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Link
      href={`/gigs/${gig.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-16/10 w-full bg-muted">
        {gig.coverImage && (
          <Image
            src={gig.coverImage}
            alt={gig.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">
            {gig.category.name}
          </span>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {gig.title}
          </h3>
        </div>
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Mulai dari</span>
          <span className="font-bold text-foreground text-sm">
            ${gig.startingPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
