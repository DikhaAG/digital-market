// src/app/admin/_components/AdminDashboardClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Users,
  Briefcase,
  FolderTree,
  ShieldCheck,
  Ban,
  UserCheck,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "user";
  banned: boolean;
  createdAt: string | Date;
}

interface AdminDashboardClientProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: "super_admin" | "admin" | "user";
    image?: string | null;
  };
  categoryTree: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string; gigCount: number }>;
  }>;
  initialGigs: Array<{
    id: string;
    title: string;
    seller?: { id?: string; name: string; image?: string | null } | null;
    category?: { id?: string; name: string; slug?: string } | null;
  }>;
  totalGigs: number;
  adminAccounts: AdminUser[];
}

export function AdminDashboardClient({
  currentUser,
  categoryTree,
  initialGigs,
  totalGigs,
  adminAccounts: initialAccounts,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const isSuperAdmin = currentUser.role === "super_admin";

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "accounts" | "categories"
  >("overview");

  // Mutasi Governance (Super Admin Only)
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Role pengguna berhasil diperbarui");
      router.refresh();
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleBanMutation = trpc.admin.toggleUserBanStatus.useMutation({
    onSuccess: (_, variables) => {
      toast.success(
        variables.banned
          ? "Akun berhasil dibekukan"
          : "Status pembekuan diaktifkan kembali",
      );
      router.refresh();
    },
    onError: (err) => toast.error(err.message),
  });

  // Hitung Metrik Dashboard
  const totalSubcategories = categoryTree.reduce(
    (acc, curr) => acc + curr.subcategories.length,
    0,
  );
  const bannedAccountsCount = initialAccounts.filter((a) => a.banned).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Ringkasan tata kelola sistem dan audit aktivitas pengelola
            marketplace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isSuperAdmin
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {isSuperAdmin ? "SUPER ADMIN" : "ADMINISTRATOR"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
            className="h-8 gap-1 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              Total Layanan (Gigs)
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalGigs}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Layanan aktif terdaftar di sistem
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              Struktur Kategori
            </CardTitle>
            <FolderTree className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{categoryTree.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {totalSubcategories} Sub-kategori terhubung
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              Akun Pengelola
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{initialAccounts.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Admin & Super Admin terdaftar
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              Akun Ditangguhkan
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-destructive">
              {bannedAccountsCount}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Akses login dibekukan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border text-xs font-semibold gap-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Audit Gig Terbaru
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab("accounts")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "accounts"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Manajemen Akun ({initialAccounts.length})
          </button>
        )}
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Pohon Kategori
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW (Audit Gig) */}
      {activeTab === "overview" && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Audit Gig Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              Daftar 8 Gig terakhir yang dipublikasikan oleh seller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/50 text-muted-foreground font-bold uppercase">
                  <tr>
                    <th className="p-3">Judul Layanan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Seller</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {initialGigs.map((gig) => (
                    <tr key={gig.id} className="hover:bg-muted/30">
                      <td className="p-3 font-semibold text-foreground">
                        {gig.title}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {gig.category?.name ?? "Tidak Berkategori"}
                      </td>
                      <td className="p-3 font-medium">
                        {gig.seller?.name ?? "Anonim"}
                      </td>
                    </tr>
                  ))}
                  {initialGigs.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-muted-foreground"
                      >
                        Belum ada data Gig yang tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: ACCOUNTS MANAGEMENT (Super Admin Only) */}
      {activeTab === "accounts" && isSuperAdmin && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Tata Kelola Akun Pengelola
            </CardTitle>
            <CardDescription className="text-xs">
              Ubah perizinan role atau bekukan status akun tim pengelola secara
              langsung.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/50 text-muted-foreground font-bold uppercase">
                  <tr>
                    <th className="p-3">Nama & Email</th>
                    <th className="p-3">Role Saat Ini</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {initialAccounts.map((acc) => {
                    const isSelf = acc.id === currentUser.id;
                    return (
                      <tr key={acc.id} className="hover:bg-muted/30">
                        <td className="p-3">
                          <div className="font-bold text-foreground">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {acc.email}
                          </div>
                        </td>
                        <td className="p-3 font-semibold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              acc.role === "super_admin"
                                ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            }`}
                          >
                            {acc.role}
                          </span>
                        </td>
                        <td className="p-3">
                          {acc.banned ? (
                            <span className="inline-flex items-center gap-1 text-destructive font-bold text-[11px]">
                              <Ban className="h-3 w-3" /> Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <UserCheck className="h-3 w-3" /> Aktif
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {isSelf ? (
                            <span className="text-[11px] italic text-muted-foreground">
                              Akun Anda
                            </span>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={updateRoleMutation.isPending}
                                onClick={() =>
                                  updateRoleMutation.mutate({
                                    targetUserId: acc.id,
                                    newRole:
                                      acc.role === "super_admin"
                                        ? "admin"
                                        : "super_admin",
                                  })
                                }
                                className="h-7 text-[11px] px-2"
                              >
                                {acc.role === "super_admin"
                                  ? "Demote to Admin"
                                  : "Promote to Super Admin"}
                              </Button>

                              <Button
                                variant={acc.banned ? "default" : "destructive"}
                                size="sm"
                                disabled={toggleBanMutation.isPending}
                                onClick={() =>
                                  toggleBanMutation.mutate({
                                    targetUserId: acc.id,
                                    banned: !acc.banned,
                                  })
                                }
                                className="h-7 text-[11px] px-2"
                              >
                                {acc.banned ? "Unban" : "Ban"}
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: CATEGORY TREE BREAKDOWN */}
      {activeTab === "categories" && (
        <div className="grid gap-4 md:grid-cols-2">
          {categoryTree.map((parent) => (
            <Card key={parent.id} className="border-border/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-primary" />
                  {parent.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {parent.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between text-xs p-2 rounded bg-muted/40"
                    >
                      <span className="font-medium text-foreground">
                        {sub.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {sub.gigCount} Gigs
                      </span>
                    </div>
                  ))}
                  {parent.subcategories.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      Belum ada sub-kategori.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
