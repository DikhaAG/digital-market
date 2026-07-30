"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Heart, Menu, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ACCOUNT_NAV_LINKS,
  MAIN_NAV_LINKS,
} from "@/features/user/layout/nav/data/links";
import { BrandLogo } from "@/components/BrandLogo";
import { SearchBar } from "./SearchBar";
import { LinksGroup } from "./LinksGroup";
import { CategoryAccordion } from "./CategoryAccordion";

export function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 md:gap-8">
        <BrandLogo />
        <div className="flex-1 max-w-2xl">
          <SearchBar variant="desktop" />
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0"></div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="w-10 h-10" aria-hidden="true" />

          <BrandLogo />
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-foreground cursor-pointer"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                }
              />

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] p-0 flex flex-col"
              >
                <SheetHeader className="p-6 pb-4 text-left ">
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-3 text-muted-foreground font-normal text-sm space-y-1">
                  <CategoryAccordion onLinkClick={closeSheet} />
                </div>

                <div className="p-6 bg-background border-t border-border">
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
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>

        <div className="px-4 pb-3">
          <SearchBar variant="mobile" />
        </div>
      </div>
    </div>
  );
}
