"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { UpsertGigDialog } from "./_components/dialogs/upsert-gig-dialog";
import { GigCard } from "./_components/gig-card";

export default function GigsAdminPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = trpc.admin.getGigsForAudit.useQuery(
    {
      search,
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      staleTime: 1000 * 60 * 3, // Cache data selama 3 menit[cite: 23]
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Gigs & Marketplace Audit
          </h2>
          <p className="text-sm text-muted-foreground">
            Audit publikasi layanan freelance, pemantauan seller, dan
            penyesuaian harga paket.
          </p>
        </div>
        <UpsertGigDialog />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan judul Gig..."
            className="pl-9 h-9 text-xs rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset otomatis ke halaman pertama saat mencari[cite: 23]
            }}
          />
        </div>
      </div>

      {/* Grid View & Skeleton Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/60 rounded-2xl p-4 space-y-3 bg-card"
            >
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="pt-2 flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border/80 pt-4 gap-3">
            <p className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-bold text-foreground">
                {data.items.length}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-foreground">{data.total}</span>{" "}
              Total Gig
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg gap-1"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </Button>
              <span className="text-xs font-bold px-2">
                {page} / {data.totalPages || 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg gap-1"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/20 space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">
            Tidak ada Gig yang ditemukan.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Coba ubah kata kunci pencarian atau tambah Gig baru.
          </p>
        </div>
      )}
    </div>
  );
}
