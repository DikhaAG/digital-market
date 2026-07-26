"use client";

import { Separator } from "@/components/ui/separator";

// Import Views
import { AuthenticatedDesktopViewNavbar } from "./authenticated/DesktopView";
import { AuthenticatedMobileViewNavbar } from "./authenticated/MobileView";
import { GuestDesktopViewNavbar } from "./guest/DesktopView";
import { GuestMobileViewNavbar } from "./guest/MobileView";
import { CategoriesNav } from "./Categories";

interface BuyerNavbarProps {
  isAuthenticated?: boolean; // Dapat dihubungkan ke session/state auth Anda
}

export function BuyerNavbar({ isAuthenticated = false }: BuyerNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {isAuthenticated ? (
        <>
          <AuthenticatedMobileViewNavbar />
          <AuthenticatedDesktopViewNavbar />
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
