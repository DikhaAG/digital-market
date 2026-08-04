"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  Edit3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GigFormDialog } from "./_components/GigFormDialog";

export default function GigModerationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Baca State Awal dari URL Search Params
  const querySearch = searchParams.get("search") ?? "";
  const queryCategoryId = searchParams.get("categoryId") ?? "";
  const querySellerId = searchParams.get("sellerId") ?? "";
  const querySortBy =
    (searchParams.get("sortBy") as "createdAt" | "title") || "createdAt";
  const querySortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = Number(searchParams.get("page") ?? "1");

  // Local state untuk pencarian agar mengetik terasa responsif (tanpa lag)
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const debouncedSearch = useDebounce(searchTerm, 350);

  // 2. Helper Sinkronisasi State ke URL Params
  const updateQueryParams = (paramsToUpdate: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Efek ketika debouncedSearch berubah -> Update URL & Reset ke Halaman 1
  useEffect(() => {
    if (debouncedSearch !== querySearch) {
      updateQueryParams({ search: debouncedSearch || null, page: "1" });
    }
  }, [debouncedSearch]);

  // 3. Query Data Master untuk Dropdown Filter & Audit List
  const utils = trpc.useUtils();
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery();
  const { data: sellers } = trpc.admin.getAllSellers.useQuery();

  const { data, isLoading, isFetching } = trpc.admin.getGigsForAudit.useQuery({
    search: querySearch || undefined,
    categoryId: queryCategoryId || undefined,
    sellerId: querySellerId || undefined,
    sortBy: querySortBy,
    sortOrder: querySortOrder,
    page,
    limit: 10,
  });

  const deleteGigMutation = trpc.admin.deleteGig.useMutation({
    onSuccess: () => {
      utils.admin.getGigsForAudit.invalidate();
    },
  });

  // Handler Sorting Kolom Header
  const handleSort = (field: "createdAt" | "title") => {
    if (querySortBy === field) {
      // Toggle ASC <-> DESC
      const nextOrder = querySortOrder === "asc" ? "desc" : "asc";
      updateQueryParams({ sortOrder: nextOrder });
    } else {
      // Ubah kolom sorting, default DESC
      updateQueryParams({ sortBy: field, sortOrder: "desc" });
    }
  };

  // Render Icon Sorting pada Header
  const renderSortIcon = (field: "createdAt" | "title") => {
    if (querySortBy !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />;
    }
    return querySortOrder === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const hasActiveFilters = Boolean(
    querySearch ||
    queryCategoryId ||
    querySellerId ||
    querySortBy !== "createdAt",
  );

  const resetFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Gig Audit & Moderation
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau, filter, dan kelola seluruh publikasi jasa dari seller di
            marketplace.
          </p>
        </div>

        <GigFormDialog />
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul gig..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 text-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Category */}
          <select
            value={queryCategoryId}
            onChange={(e) =>
              updateQueryParams({
                categoryId: e.target.value || null,
                page: "1",
              })
            }
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-medium text-foreground focus:outline-hidden"
          >
            <option value="">Semua Kategori</option>
            {categoryTree?.map((parent) => (
              <optgroup key={parent.id} label={parent.name}>
                {parent.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Filter Seller */}
          <select
            value={querySellerId}
            onChange={(e) =>
              updateQueryParams({ sellerId: e.target.value || null, page: "1" })
            }
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-medium text-foreground focus:outline-hidden"
          >
            <option value="">Semua Seller</option>
            {sellers?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Reset Filter Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground h-9"
            >
              <X className="h-3.5 w-3.5" />
              Reset Semua Filter
            </Button>
          )}
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs relative">
        {/* Loading overlay indicator saat fetching ulang data di background */}
        {isFetching && !isLoading && (
          <div className="absolute top-2 right-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground font-medium">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            Memperbarui...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
              <tr>
                {/* Interactive Sorting Header: Title */}
                <th
                  className="p-4 cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Gig Info</span>
                    {renderSortIcon("title")}
                  </div>
                </th>

                <th className="p-4">Seller</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Paket Available</th>

                {/* Interactive Sorting Header: CreatedAt */}
                <th
                  className="p-4 cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tanggal Buat</span>
                    {renderSortIcon("createdAt")}
                  </div>
                </th>

                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Filter className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-semibold text-sm">
                        Tidak ada Gig ditemukan.
                      </p>
                      <p className="text-xs">
                        Coba sesuaikan kata kunci atau filter pencarian Anda.
                      </p>
                    </div>
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
                          <p className="text-xs text-muted-foreground truncate">
                            Slug: {gig.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Seller Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={gig.seller?.image ?? undefined}
                            alt={gig.seller?.name ?? "Seller"}
                          />
                          <AvatarFallback className="text-[10px] font-bold">
                            {gig.seller?.name
                              ? gig.seller.name.trim().slice(0, 2).toUpperCase()
                              : "US"}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`font-semibold text-xs ${
                            gig.seller?.name
                              ? "text-foreground"
                              : "text-muted-foreground italic"
                          }`}
                        >
                          {gig.seller?.name ?? "Deleted Seller"}
                        </span>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="p-4">
                      <Badge
                        variant={gig.category?.name ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {gig.category?.name ?? "Uncategorized"}
                      </Badge>
                    </td>

                    {/* Paket Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {gig.packages?.map((pkg) => (
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

                    {/* CreatedAt Date */}
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(gig.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <GigFormDialog
                          gigId={gig.id}
                          trigger={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          }
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          nativeButton={false}
                          render={
                            <Link href={`/gigs/${gig.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          }
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

        {/* PAGINATION FOOTER */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Menampilkan Halaman {page} dari {data.totalPages} ({data.total}{" "}
              Total Gig)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => updateQueryParams({ page: String(page - 1) })}
              >
                Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => updateQueryParams({ page: String(page + 1) })}
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
