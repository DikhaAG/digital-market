"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import hook usePathname
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { BrandLogo } from "@/components/BrandLogo";
import { SearchBar } from "./SearchBar";
import { CategoryAccordion } from "./CategoryAccordion";

export function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // 2. Dapatkan pathname URL saat ini

  // 3. Flag penanda jika user berada di Homepage ("/")
  const isHomePage = pathname === "/";

  const closeSheet = () => setOpen(false);

  return (
    <nav className="w-full">
      <div className="container mx-auto px-4">
        {/* ================= DESKTOP VIEW (md:flex) ================= */}
        <div className="hidden md:flex h-16 items-center justify-between gap-6 md:gap-8">
          {/* 1. Logo Brand */}
          <BrandLogo />

          {/* 2. SearchBar Tengah (Hanya tampil jika BUKAN di halaman beranda "/") */}
          {!isHomePage ? (
            <div className="flex-1 max-w-2xl">
              <SearchBar variant="desktop" />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* 3. CTA Action Button */}
          <div className="flex items-center gap-4 shrink-0">
            <Button
              nativeButton={false}
              render={<Link href="/order">Cek Pesanan</Link>}
              className="font-bold h-10 px-5 text-sm rounded-md"
            ></Button>
          </div>
        </div>

        {/* ================= MOBILE VIEW (md:hidden) ================= */}
        <div className="flex flex-col md:hidden py-2.5 gap-3">
          {/* Top Row: Logo di Kiri & Mobile Menu Trigger di Kanan */}
          <div className="flex items-center justify-between">
            <BrandLogo />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-foreground cursor-pointer"
                    aria-label="Buka Menu Navigasi"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                }
              ></SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] p-0 flex flex-col"
              >
                <SheetHeader className="p-6 pb-4 text-left border-b border-border">
                  <SheetTitle className="text-base font-bold">
                    Navigasi Menu
                  </SheetTitle>
                </SheetHeader>

                {/* Body Accordion Categories */}
                <div className="flex-1 overflow-y-auto p-4 text-muted-foreground font-normal text-sm space-y-1">
                  <CategoryAccordion onLinkClick={closeSheet} />
                </div>

                {/* Footer Action Button */}
                <div className="p-4 bg-background border-t border-border">
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/order" onClick={closeSheet}>
                        Cek Pesanan
                      </Link>
                    }
                    className="w-full font-bold h-11 text-base rounded-md"
                  ></Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Bottom Row: Mobile SearchBar (Hanya tampil jika BUKAN di halaman beranda "/") */}
          {!isHomePage && (
            <div>
              <SearchBar variant="mobile" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
