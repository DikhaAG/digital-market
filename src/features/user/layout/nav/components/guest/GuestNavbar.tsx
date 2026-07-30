"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNavbarLogo } from "../Logo";
import { CategoryAccordion } from "../CategoryAccordion";

export function GuestNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah mismatch hydration antara Server dan Client pada komponen Sheet
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4">
        <UserNavbarLogo />

        {/* Nav Right Links & Actions */}
        <div className="flex items-center gap-6 text-sm font-bold text-foreground">
          {/* Divider */}
          <div className="h-4 w-[1px] bg-border my-auto" />
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
                  <UserNavbarLogo />
                </SheetHeader>

                {/* Navigation Menu List */}
                <div className="p-6 space-y-5 font-semibold text-foreground text-base">
                  <CategoryAccordion onLinkClick={closeSheet} />
                  <Separator className="my-4" />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-border space-y-3 bg-background">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/register" onClick={closeSheet}>
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
            className="h-10 w-10 text-foreground -ml-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Center Item: Logo */}
        <div className="flex justify-center">
          <UserNavbarLogo />
        </div>

        {/* Right Spacer: Penyeimbang Grid 3 Kolom */}
        <div className="flex justify-end">
          {/* Tempatkan icon/tombol kanan di sini di masa mendatang jika diperlukan */}
        </div>
      </div>
    </div>
  );
}
