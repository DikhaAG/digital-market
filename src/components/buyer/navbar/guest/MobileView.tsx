"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BuyerNavbarLogo } from "../Logo";

export function GuestMobileViewNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex md:hidden items-center justify-between px-4 h-14">
      {/* Sidebar Trigger (Menu Hamburger) */}
      {mounted ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent transition-colors cursor-pointer touch-manipulation select-none -ml-2"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Navigation</span>
          </SheetTrigger>

          {/* Sidebar Drawer Content (Gambar 3) */}
          <SheetContent
            side="left"
            className="w-full sm:w-[380px] p-0 flex flex-col justify-between"
          >
            <div>
              {/* Header: Logo */}
              <SheetHeader className="p-4 border-b border-border text-left">
                <SheetTitle render={<BuyerNavbarLogo />}></SheetTitle>
              </SheetHeader>

              {/* Navigation Menu List */}
              <div className="p-6 space-y-5 font-semibold text-foreground text-base">
                <Link
                  href="/categories"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Jelajahi Katogori</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Separator className="my-4" />
              </div>
            </div>

            {/* Bottom Actions (Join Fiverr & Sign in) */}
            <div className="p-6 border-t border-border space-y-3 bg-background">
              <Button
                nativeButton={false}
                render={
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Join Fiverr
                  </Link>
                }
                className="w-full font-bold h-11 text-base rounded-md"
              ></Button>
              <Button
                nativeButton={false}
                render={
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Masuk
                  </Link>
                }
                variant="outline"
                className="w-full font-bold h-11 text-base rounded-md"
              ></Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Center Logo */}
      <BuyerNavbarLogo />

      {/* Right Action: Join Button */}
      <Button
        render={<Link href="/register">Join</Link>}
        nativeButton={false}
        size="sm"
        className="font-bold px-4 h-9 rounded-md"
      ></Button>
    </div>
  );
}
