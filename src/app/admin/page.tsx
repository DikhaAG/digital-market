"use client";

import { trpc } from "@/lib/trpc/client";
import {
  Users,
  Briefcase,
  FolderTree,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registered Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Pembeli & Penjual terdaftar",
    },
    {
      title: "Active Gigs",
      value: stats?.totalGigs ?? 0,
      icon: Briefcase,
      description: "Layanan aktif di marketplace",
    },
    {
      title: "Master Categories",
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      description: "Kategori & sub-kategori",
    },
    {
      title: "Avg. Package Price",
      value: `$${stats?.averagePackagePrice ?? 0}`,
      icon: DollarSign,
      description: "Rata-rata harga paket",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          System Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Ringkasan statistik real-time platform marketplace Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
