// src/app/admin/gigs/_components/gig-card.tsx
"use client";

import Image from "next/image";
import { User, Tag, DollarSign, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/app/admin/categories/components/delete-confirm-dialog";
import { UpsertGigDialog } from "./dialogs/upsert-gig-dialog";
import { useGigMutation } from "../_hooks/use-gig-mutation";
import { type GigAuditItem } from "../_schemas/gig-admin-schema";

interface GigCardProps {
  gig: GigAuditItem;
}

export function GigCard({ gig }: GigCardProps) {
  const { trpc, createOptions } = useGigMutation();
  const deleteMutation = trpc.admin.deleteGig.useMutation(
    createOptions({ successMessage: "Gig berhasil dihapus" }),
  );

  const startingPrice = gig.packages[0]?.price ?? 0;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-border/100 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between group">
      <div className="space-y-3 min-w-0">
        {/* Header Image dengan Fluid Aspect-Ratio */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border/40">
          {gig.coverImage ? (
            <Image
              src={gig.coverImage}
              alt={gig.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground font-medium bg-muted/30">
              <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
              <span>Tidak Ada Gambar</span>
            </div>
          )}
          {gig.category && (
            <Badge className="absolute top-2.5 left-2.5 bg-background/90 text-foreground backdrop-blur-md text-[10px] font-bold border border-border/40 shadow-xs max-w-[85%] truncate">
              <Tag className="h-3 w-3 mr-1 text-primary shrink-0 inline" />
              <span className="truncate">{gig.category.name}</span>
            </Badge>
          )}
        </div>

        {/* Title & Slug */}
        <div className="min-w-0 space-y-1">
          <h4 className="font-extrabold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {gig.title}
          </h4>
          <p className="text-[11px] font-mono text-muted-foreground truncate">
            /gigs/{gig.slug}
          </p>
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate font-medium max-w-[80px] sm:max-w-[100px]">
              {gig.seller?.name ?? "Seller N/A"}
            </span>
          </div>
          <span className="shrink-0">•</span>
          <div className="flex items-center font-extrabold text-foreground shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[11px]">
            <DollarSign className="h-3 w-3 shrink-0" />
            <span>{startingPrice}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <UpsertGigDialog gigToEdit={gig} />
          <DeleteConfirmDialog
            title={`Hapus Gig "${gig.title}"?`}
            description="Tindakan ini tidak dapat dibatalkan. Seluruh paket dan pesanan terkait gig ini mungkin terpengaruh."
            onConfirm={() => deleteMutation.mutate({ id: gig.id })}
            isPending={deleteMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
