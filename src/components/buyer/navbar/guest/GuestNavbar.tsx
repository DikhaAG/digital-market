"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";

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

export function GuestNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah mismatch hydration antara Server dan Client pada komponen Sheet
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4">
        <BuyerNavbarLogo />

        {/* Nav Right Links & Actions */}
        <div className="flex items-center gap-6 text-sm font-bold text-foreground">
          <Link
            href="/become-seller"
            className="hover:text-emerald-500 transition-colors"
          >
            Menjadi Penjual
          </Link>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-border my-auto" />

          <Link
            href="/login"
            className="hover:text-emerald-500 transition-colors"
          >
            Sign in
          </Link>

          <Button
            nativeButton={false}
            render={<Link href="/register">Join</Link>}
            size="sm"
            className="font-bold px-5 h-9 rounded-md"
          ></Button>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="flex md:hidden items-center justify-between px-4 h-14">
        {/* Left Action: Sidebar Drawer Trigger */}
        {mounted ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-foreground -ml-2 cursor-pointer"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Navigation</span>
                </Button>
              }
            ></SheetTrigger>
            {/* Sidebar Drawer Content */}
            <SheetContent
              side="left"
              className="w-full sm:w-[380px] p-0 flex flex-col justify-between"
            >
              <div>
                {/* Header Logo */}
                <SheetHeader className="p-4 border-b border-border text-left">
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <BuyerNavbarLogo />
                </SheetHeader>

                {/* Navigation Menu List */}
                <div className="p-6 space-y-5 font-semibold text-foreground text-base">
                  <Link
                    href="/categories"
                    onClick={closeSheet}
                    className="flex items-center justify-between py-1 hover:text-emerald-500 transition-colors"
                  >
                    <span>Jelajahi Kategori</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Separator className="my-4" />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-border space-y-3 bg-background">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/register" onClick={closeSheet}>
                      Join
                    </Link>
                  }
                  className="w-full font-bold h-11 text-base rounded-md"
                ></Button>
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/login" onClick={closeSheet}>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-foreground -ml-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Center Logo */}
        <BuyerNavbarLogo />

        {/* Right Action: Join Button */}
        <Button
          nativeButton={false}
          render={<Link href="/register">Join</Link>}
          size="sm"
          className="font-bold px-4 h-9 rounded-md"
        ></Button>
      </div>
    </header>
  );
}
