"use client";

import { Separator } from "@/components/ui/separator";

import { GuestDesktopViewNavbar } from "./guest/DesktopView";
import { GuestMobileViewNavbar } from "./guest/MobileView";
import { CategoriesNav } from "./Categories";
import { AuthenticatedNavbar } from "./authenticated/AuthencicatedNavbar";

interface BuyerNavbarProps {
  isAuthenticated?: boolean; // Dapat dihubungkan ke session/state auth Anda
}

export function BuyerNavbar({ isAuthenticated = true }: BuyerNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {isAuthenticated ? (
        <>
          <AuthenticatedNavbar />
        </>
      ) : (
        <>
          <GuestMobileViewNavbar />
          <GuestDesktopViewNavbar />
        </>
      )}

      <Separator />
      <CategoriesNav />
    </header>
  );
}
