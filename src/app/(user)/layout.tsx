import React from "react";
import { HomeNavbar } from "./_components/HomeNavbar";
import { Separator } from "@/components/ui/separator";
import { UserFooter } from "./_components/Footer";
import { CategoryNav } from "./_components/CategoryNav";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* 
      - flex-1: Mengisi sisa ruang kosong dari body RootLayout.
      - flex flex-col: Memungkinkan <main className="flex-1"> mendorong User ke paling bawah (Sticky Footer).
      - Tidak perlu min-h-screen, bg-background, atau font-sans lagi karena sudah ditangani RootLayout.
    */
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <HomeNavbar />
        <Separator />
        <CategoryNav />
      </header>
      <main className="flex-1 px-4 py-6">{children}</main>

      <UserFooter />
    </div>
  );
}
