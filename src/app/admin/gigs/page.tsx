"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Search, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GigModerationPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.getGigsForAudit.useQuery({
    search,
    page,
    limit: 10,
  });

  const deleteGigMutation = trpc.admin.deleteGig.useMutation({
    onSuccess: () => {
      utils.admin.getGigsForAudit.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Gig Audit & Moderation
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau dan kelola seluruh publikasi jasa dari seller di marketplace.
          </p>
        </div>

        {/* Filter Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul gig..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Moderation Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
              <tr>
                <th className="p-4">Gig Info</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Paket Available</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Tidak ada Gig ditemukan.
                  </td>
                </tr>
              ) : (
                data?.items.map((gig) => (
                  <tr
                    key={gig.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Gig Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                          {gig.coverImage ? (
                            <Image
                              src={gig.coverImage}
                              alt={gig.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              No Cover
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs space-y-0.5">
                          <p className="font-bold text-foreground truncate">
                            {gig.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Slug: {gig.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={gig.seller.image ?? ""} />
                          <AvatarFallback>
                            {gig.seller.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-xs text-foreground">
                          {gig.seller.name}
                        </span>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {gig.category.name}
                      </Badge>
                    </td>

                    {/* Paket Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {gig.packages.map((pkg) => (
                          <Badge
                            key={pkg.id}
                            variant="outline"
                            className="text-[10px] uppercase font-bold"
                          >
                            {pkg.packageType}: ${pkg.price}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          nativeButton={false}
                          render={
                            <Link href={`/gigs/${gig.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          }
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        ></Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            deleteGigMutation.mutate({ id: gig.id })
                          }
                          disabled={deleteGigMutation.isPending}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Halaman {page} dari {data.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
