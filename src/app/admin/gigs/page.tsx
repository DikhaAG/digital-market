// src/app/admin/gigs/page.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

import { UpsertGigDialog } from "./_components/dialogs/upsert-gig-dialog";
import { GigCard } from "./_components/gig-card";
import { type GigAuditItem } from "./_schemas/gig-admin-schema";

function useGigAuditController(limit = 8) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = trpc.admin.getGigsForAudit.useQuery(
    {
      search,
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      staleTime: 1000 * 60 * 3,
      refetchOnWindowFocus: false,
    },
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    page,
    setPage,
    handleSearchChange,
    ...query,
  };
}

export default function GigsAdminPage() {
  const { search, page, setPage, handleSearchChange, data, isLoading } =
    useGigAuditController(8);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Gigs & Marketplace Audit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Audit publikasi layanan freelance, pemantauan seller, dan
            penyesuaian harga paket.
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-auto w-full sm:w-auto">
          <UpsertGigDialog />
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan judul Gig..."
            className="pl-9 h-10 sm:h-9 text-xs rounded-xl transition-all"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/60 rounded-2xl p-4 space-y-3 bg-card"
            >
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="pt-2 flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {data.items.map((gig: GigAuditItem) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>

          {/* Controls Paginasi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border/80 pt-4 gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Menampilkan{" "}
              <span className="font-bold text-foreground">
                {data.items.length}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-foreground">{data.total}</span>{" "}
              Total Gig
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-9 sm:h-8 text-xs rounded-xl gap-1 px-3"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-muted/60">
                {page} / {data.totalPages || 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-9 sm:h-8 text-xs rounded-xl gap-1 px-3"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10 space-y-2">
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
