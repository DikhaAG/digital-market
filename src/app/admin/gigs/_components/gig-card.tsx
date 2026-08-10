"use client";

import Image from "next/image";
import { User, Tag, DollarSign } from "lucide-react";
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
    <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-border transition-all space-y-3 flex flex-col justify-between">
      <div className="space-y-3 min-w-0">
        {/* Header Image & Category Badge */}
        <div className="relative h-36 w-full rounded-xl overflow-hidden bg-muted">
          {gig.coverImage ? (
            <Image
              src={gig.coverImage}
              alt={gig.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground font-medium">
              Tidak Ada Gambar
            </div>
          )}
          {gig.category && (
            <Badge className="absolute top-2.5 left-2.5 bg-background/90 text-foreground backdrop-blur-xs text-[10px] font-bold shadow-xs">
              <Tag className="h-3 w-3 mr-1 text-primary inline" />
              <span className="truncate max-w-[120px]">
                {gig.category.name}
              </span>
            </Badge>
          )}
        </div>

        {/* Title & Slug */}
        <div className="min-w-0">
          <h4 className="font-extrabold text-sm sm:text-base text-foreground line-clamp-2 leading-snug">
            {gig.title}
          </h4>
          <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
            /{gig.slug}
          </p>
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate font-medium max-w-[90px]">
              {gig.seller?.name ?? "Seller N/A"}
            </span>
          </div>
          <span className="shrink-0">•</span>
          <div className="flex items-center font-bold text-foreground shrink-0">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
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
