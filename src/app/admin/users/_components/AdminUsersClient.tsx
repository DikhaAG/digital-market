// src/app/admin/users/_components/AdminUsersClient.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Users,
  ShieldCheck,
  Store,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Ban,
  ShieldAlert,
  Loader2,
  RefreshCw,
  UserX,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminUsersClientProps {
  currentUser: {
    id: string;
    role: "super_admin" | "admin" | "user";
  };
}

function getInitials(name?: string) {
  if (!name) return "US";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminUsersClient({ currentUser }: AdminUsersClientProps) {
  const isSuperAdmin = currentUser.role === "super_admin";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "super_admin" | "admin" | "user"
  >("all");
  const [bannedFilter, setBannedFilter] = useState<"all" | "active" | "banned">(
    "all",
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const utils = trpc.useUtils();

  const { data, isLoading, isFetching } =
    trpc.admin.getUsersForManagement.useQuery(
      {
        search: search.trim() || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        banned: bannedFilter === "all" ? undefined : bannedFilter === "banned",
        page,
        limit,
      },
      { placeholderData: (prev) => prev },
    );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Role pengguna berhasil diperbarui");
      utils.admin.getUsersForManagement.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengubah role pengguna");
    },
  });

  const toggleBanMutation = trpc.admin.toggleUserBanStatus.useMutation({
    onSuccess: (_, variables) => {
      toast.success(
        variables.banned
          ? "Akun pengguna telah dibekukan"
          : "Akses akun telah diaktifkan kembali",
      );
      utils.admin.getUsersForManagement.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengubah status pembekuan akun");
    },
  });

  const handleRoleChange = (
    targetUserId: string,
    newRole: "user" | "admin" | "super_admin",
  ) => {
    if (!isSuperAdmin) {
      toast.error("Hanya Super Admin yang dapat mengubah role pengguna");
      return;
    }
    updateRoleMutation.mutate({ targetUserId, newRole });
  };

  const handleToggleBan = (
    targetUserId: string,
    currentBannedStatus: boolean,
  ) => {
    if (!isSuperAdmin) {
      toast.error("Hanya Super Admin yang dapat membekukan pengguna");
      return;
    }
    toggleBanMutation.mutate({ targetUserId, banned: !currentBannedStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Tata Kelola Pengguna
          </h1>
          <p className="text-xs text-muted-foreground">
            Manajemen daftar akun Pembeli (User), Seller (Admin), dan Super
            Admin marketplace.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => utils.admin.getUsersForManagement.invalidate()}
          disabled={isFetching}
          className="h-8 gap-1.5 text-xs font-semibold cursor-pointer w-fit"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">
              TOTAL PENGGUNA
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{data?.total ?? 0}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Akun terdaftar dalam database
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">
              SUPER ADMIN
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-purple-600">
              {data?.items.filter((u) => u.role === "super_admin").length ?? 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Pengelola tingkat tertinggi
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">
              SELLER (ADMIN)
            </CardTitle>
            <Store className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-600">
              {data?.items.filter((u) => u.role === "admin").length ?? 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Pengelola jasa & toko marketplace
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground">
              AKUN DIBEKUKAN
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-destructive">
              {data?.items.filter((u) => u.banned).length ?? 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Akses login ditangguhkan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama pengguna..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as typeof roleFilter);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="all">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Seller (Admin)</option>
            <option value="user">User Biasa</option>
          </select>

          <select
            value={bannedFilter}
            onChange={(e) => {
              setBannedFilter(e.target.value as typeof bannedFilter);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="banned">Dibekukan</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Role RBAC</th>
                <th className="px-4 py-3">Status Akun</th>
                <th className="px-4 py-3">Terdaftar</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                data?.items.map((item) => {
                  const isSelf = item.id === currentUser.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-lg border">
                            <AvatarImage
                              src={item.image ?? ""}
                              alt={item.name}
                            />
                            <AvatarFallback className="rounded-lg font-bold text-[10px] bg-primary/10 text-primary">
                              {getInitials(item.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid leading-tight">
                            <span className="font-bold text-foreground flex items-center gap-1.5">
                              {item.name}
                              {isSelf && (
                                <span className="text-[9px] bg-muted px-1.5 py-0.2 rounded font-semibold text-muted-foreground border">
                                  Anda
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            item.role === "super_admin"
                              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              : item.role === "admin"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-gray-500/10 text-gray-600 border border-gray-500/20"
                          }`}
                        >
                          {item.role === "super_admin" ? (
                            <>
                              <ShieldCheck className="h-3 w-3" /> Super Admin
                            </>
                          ) : item.role === "admin" ? (
                            <>
                              <Store className="h-3 w-3" /> Seller (Admin)
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3" /> User Biasa
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {item.banned ? (
                          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase bg-destructive/10 text-destructive border border-destructive/20">
                            <Ban className="h-3 w-3" /> Dibekukan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <UserCheck className="h-3 w-3" /> Aktif
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 cursor-pointer"
                                disabled={!isSuperAdmin || isSelf}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            }
                          ></DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 text-xs"
                          >
                            <DropdownMenuLabel>
                              Ubah Role RBAC
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(item.id, "super_admin")
                              }
                              disabled={item.role === "super_admin"}
                              className="cursor-pointer"
                            >
                              <ShieldCheck className="mr-2 h-3.5 w-3.5 text-purple-600" />
                              Jadikan Super Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(item.id, "admin")}
                              disabled={item.role === "admin"}
                              className="cursor-pointer"
                            >
                              <Store className="mr-2 h-3.5 w-3.5 text-blue-600" />
                              Jadikan Seller (Admin)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(item.id, "user")}
                              disabled={item.role === "user"}
                              className="cursor-pointer"
                            >
                              <UserCheck className="mr-2 h-3.5 w-3.5 text-gray-600" />
                              Jadikan User Biasa
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuLabel>Akses Akun</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleBan(item.id, item.banned)
                              }
                              className={`cursor-pointer ${
                                item.banned
                                  ? "text-emerald-600 focus:text-emerald-600"
                                  : "text-destructive focus:text-destructive"
                              }`}
                            >
                              {item.banned ? (
                                <>
                                  <UserCheck className="mr-2 h-3.5 w-3.5" />
                                  Aktifkan Akun
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="mr-2 h-3.5 w-3.5" />
                                  Bekukan Akun
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <span className="text-[11px] text-muted-foreground">
              Menampilkan Halaman{" "}
              <strong className="text-foreground">{page}</strong> dari{" "}
              <strong className="text-foreground">{data.totalPages}</strong>{" "}
              (Total {data.total} akun)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="h-7 w-7 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages || isFetching}
                className="h-7 w-7 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
