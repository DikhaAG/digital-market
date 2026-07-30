import React from "react";
import { HomeNavbar } from "./_components/HomeNavbar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { UserFooter } from "./_components/Footer";
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
        <div className="container mx-auto px-4 relative flex items-center overflow-x-auto no-scrollbar py-2 text-sm text-muted-foreground whitespace-nowrap gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="hover:text-foreground transition-colors py-2 shrink-0"
            >
              {category.name}
            </Link>
          ))}
          <div className="sticky right-0 bg-gradient-to-l pointer-events-none from-background via-background/90 to-transparent pl-6 pr-2 flex items-center shrink-0">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">{children}</main>

      <UserFooter />
    </div>
  );
}
