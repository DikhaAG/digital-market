// src/app/(user)/gigs/[slug]/_components/PackageTabs.tsx
"use client";

import { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app";
import {
  Clock,
  RotateCcw,
  Check,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Infer tipe dari output tRPC router secara otomatis
type RouterOutputs = inferRouterOutputs<AppRouter>;
type GigGetBySlugOutput = NonNullable<RouterOutputs["gig"]["getBySlug"]>;
export type GigPackage = GigGetBySlugOutput["packages"][number];

interface PackageTabsProps {
  packages: GigPackage[];
  sellerName: string;
}

export function PackageTabs({ packages, sellerName }: PackageTabsProps) {
  const orderMap: Record<string, number> = {
    basic: 1,
    standard: 2,
    premium: 3,
  };
  const sortedPackages = [...packages].sort(
    (a, b) => (orderMap[a.packageType] ?? 0) - (orderMap[b.packageType] ?? 0),
  );

  const [activeType, setActiveType] = useState<string>(
    sortedPackages[0]?.packageType ?? "basic",
  );

  const selectedPackage =
    sortedPackages.find((p) => p.packageType === activeType) ??
    sortedPackages[0];

  if (!selectedPackage) {
    return (
      <div className="p-6 border border-border rounded-2xl bg-card text-center text-sm text-muted-foreground">
        Belum ada paket yang tersedia untuk layanan ini.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl bg-card shadow-sm overflow-hidden sticky top-24">
      <Tabs value={activeType} onValueChange={setActiveType} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/50 p-1 rounded-none border-b border-border">
          {sortedPackages.map((pkg) => (
            <TabsTrigger
              key={pkg.id}
              value={pkg.packageType}
              className="capitalize text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-primary transition-all cursor-pointer"
            >
              {pkg.packageType}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
              {selectedPackage.title}
            </h3>
            <span className="text-2xl font-black text-foreground">
              ${selectedPackage.price}
            </span>
          </div>
          {selectedPackage.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedPackage.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{selectedPackage.deliveryTimeDays} Hari Pengiriman</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>
              {selectedPackage.revisions === 99
                ? "Revisi Tanpa Batas"
                : `${selectedPackage.revisions} Kali Revisi`}
            </span>
          </div>
        </div>

        {selectedPackage.featureValues &&
          selectedPackage.featureValues.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-foreground">
                Fitur Terintegrasi:
              </p>
              <ul className="space-y-2 text-xs">
                {selectedPackage.featureValues.map((fv) => {
                  // Guard jika feature bernilai null atau tidak di-include
                  if (!fv.feature || (!fv.isIncluded && !fv.value)) return null;
                  return (
                    <li
                      key={fv.feature.id}
                      className="flex items-center gap-2 text-foreground/90"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {fv.feature.name}
                        {fv.value ? `: ${fv.value}` : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        <div className="space-y-2 pt-2">
          <Button className="w-full h-11 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-2">
            <span>Pesan Sekarang (${selectedPackage.price})</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full h-10 font-semibold text-xs border-border hover:bg-muted cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Hubungi {sellerName}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
