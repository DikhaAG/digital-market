// src/components/BrandLogo.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/lib/trpc/client";

export function BrandLogo() {
  const { data: logo } = trpc.admin.getBrandLogoSettings.useQuery(undefined, {
    staleTime: Infinity, // Menghindari refetch tidak perlu
  });

  const logoType = logo?.logoType ?? "text";
  const logoText = logo?.logoText ?? "";
  const logoTextAccent = logo?.logoTextAccent ?? ".";
  const logoImage = logo?.logoImage ?? "";

  return (
    <Link
      href="/"
      className="flex items-center gap-1 shrink-0 transition-opacity hover:opacity-90 h-9"
    >
      {logoType === "image" && logoImage ? (
        <div className="relative h-8 w-36 flex items-center">
          <Image
            src={logoImage}
            alt={logoText || "Brand Logo"}
            fill
            priority
            sizes="144px"
            className="object-contain object-left"
          />
        </div>
      ) : (
        <span className="flex items-baseline text-2xl font-black tracking-tight text-foreground leading-none">
          {logoText}
          {logoTextAccent && (
            <span className="text-primary text-3xl leading-none">
              {logoTextAccent}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
