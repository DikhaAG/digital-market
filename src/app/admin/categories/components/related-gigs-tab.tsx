// src/app/admin/categories/components/related-gigs-tab.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Briefcase, ExternalLink, ImageIcon, User } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedGigsTabProps {
  categoryId: string;
}

export function RelatedGigsTab({ categoryId }: RelatedGigsTabProps) {
  const { data, isLoading } = trpc.admin.getGigsForAudit.useQuery({
    categoryId,
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="space-y-2 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-background/50"
          >
            <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const gigsList = data?.items ?? [];
  const totalGigs = data?.total ?? 0;

  if (gigsList.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-muted/10 space-y-1">
        <p className="text-xs font-medium text-muted-foreground italic">
          Belum ada Gig yang terhubung ke sub-kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pt-1">
      <div className="space-y-2">
        {gigsList.map((gig) => (
          <div
            key={gig.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-accent/30 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail Cover */}
              <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/40">
                {gig.coverImage ? (
                  <Image
                    src={gig.coverImage}
                    alt={gig.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Detail Gig */}
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-md group-hover:text-primary transition-colors">
                  {gig.title}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 truncate">
                    <User className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{gig.seller.name}</span>
                  </span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
              {gig.packages.length} Paket
            </Badge>
          </div>
        ))}
      </div>

      {/* Footer Navigasi Ke Audit Manager */}
      {totalGigs > 0 && (
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="text-[11px] font-medium text-muted-foreground">
            Menampilkan {gigsList.length} dari {totalGigs} Gig
          </span>
          <Button
            nativeButton={false}
            render={
              <Link href={`/admin/gigs?categoryId=${categoryId}`}>
                <span>Buka Audit Manager</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            }
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-primary hover:text-primary font-bold gap-1 px-2"
          ></Button>
        </div>
      )}
    </div>
  );
}
