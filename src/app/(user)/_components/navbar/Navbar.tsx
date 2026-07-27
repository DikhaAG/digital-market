"use client";

import { Separator } from "@/components/ui/separator";

import { CategoriesNav } from "./Categories";
import { AuthenticatedNavbar } from "./authenticated/AuthencicatedNavbar";
import { GuestNavbar } from "./guest/GuestNavbar";

interface UserNavbarProps {
  isAuthenticated?: boolean; // Dapat dihubungkan ke session/state auth Anda
}

export function UserNavbar({ isAuthenticated = false }: UserNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {isAuthenticated ? (
        <>
          <AuthenticatedNavbar />
        </>
      ) : (
        <>
          <GuestNavbar />
        </>
      )}

      <Separator />
      <CategoriesNav />
    </header>
  );
}
