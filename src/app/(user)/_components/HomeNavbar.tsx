// src/app/(user)/_components/HomeNavbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarSearchBar } from "./NavbarSearchBar";
import { CategoryAccordion } from "./CategoryAccordion";

interface HomeNavbarProps {
  logo: React.ReactNode; // Terima RSC sebagai Node
}

export function HomeNavbar({ logo }: HomeNavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const closeSheet = () => setOpen(false);

  return (
    <nav className="w-full">
      <div className="container mx-auto px-4">
        {/* DESKTOP VIEW */}
        <div className="hidden md:flex h-16 items-center justify-between gap-6 md:gap-8">
          {/* Render RSC Prop */}
          {logo}

          {!isHomePage ? (
            <div className="flex-1 max-w-2xl">
              <NavbarSearchBar variant="desktop" />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-4 shrink-0">
            <Button
              nativeButton={false}
              render={<Link href="/order">Cek Pesanan</Link>}
              className="font-bold h-10 px-5 text-sm rounded-md"
            />
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="flex flex-col md:hidden py-2.5 gap-3">
          <div className="flex items-center justify-between">
            {/* Render RSC Prop */}
            {logo}

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
              />
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] p-0 flex flex-col"
              >
                <SheetHeader className="p-6 pb-4 text-left border-b border-border">
                  <SheetTitle className="text-base font-bold">
                    Navigasi Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 text-muted-foreground font-normal text-sm space-y-1">
                  <CategoryAccordion onLinkClick={closeSheet} />
                </div>
                <div className="p-4 bg-background border-t border-border">
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/order" onClick={closeSheet}>
                        Cek Pesanan
                      </Link>
                    }
                    className="w-full font-bold h-11 text-base rounded-md"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {!isHomePage && (
            <div>
              <NavbarSearchBar variant="mobile" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
