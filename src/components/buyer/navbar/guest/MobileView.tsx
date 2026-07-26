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
                <SheetTitle asChild>
                  <BuyerNavbarLogo />
                </SheetTitle>
              </SheetHeader>

              {/* Navigation Menu List */}
              <div className="p-6 space-y-5 font-semibold text-foreground text-base">
                <Link
                  href="/categories"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Browse categories</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/explore"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/pro"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Fiverr Pro</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Separator className="my-4" />

                {/* Preferences */}
                <button
                  type="button"
                  className="flex items-center justify-between w-full py-1 text-left hover:text-emerald-500 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    English
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-between w-full py-1 text-left hover:text-emerald-500 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-bold text-lg px-0.5">$</span>
                    USD
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Bottom Actions (Join Fiverr & Sign in) */}
            <div className="p-6 border-t border-border space-y-3 bg-background">
              <Button
                asChild
                className="w-full font-bold h-11 text-base rounded-md"
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  Join Fiverr
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full font-bold h-11 text-base rounded-md"
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
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
      <Button asChild size="sm" className="font-bold px-4 h-9 rounded-md">
        <Link href="/register">Join</Link>
      </Button>
    </div>
  );
}
