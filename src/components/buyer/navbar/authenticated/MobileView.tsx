"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BuyerNavbarLogo } from "../Logo";
import { ACCOUNT_NAV_LINKS, MAIN_NAV_LINKS } from "@/config/buyer/nav/links";

interface AuthenticatedMobileViewNavbarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

export function AuthenticatedMobileViewNavbar({
  user = { name: "dikhaag", avatarUrl: "/avatar.png" },
}: AuthenticatedMobileViewNavbarProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <div className="flex flex-col md:hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 h-14">
        {/* Placeholder penyeimbang posisi logo agar presisi dengan trigger (w-10) */}
        <div className="w-10 h-10" aria-hidden="true" />

        <BuyerNavbarLogo />

        {/* Sheet Drawer Navigation */}
        {mounted ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent active:bg-accent transition-colors cursor-pointer touch-manipulation select-none"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] p-0 flex flex-col"
            >
              <SheetHeader className="p-6 pb-4 border-b border-border text-left">
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-amber-700 text-amber-50 font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-base text-foreground">
                    {user.name}
                  </span>
                </div>
              </SheetHeader>

              {/* Sidebar Navigation Items */}
              <div className="flex-1 overflow-y-auto p-3 text-muted-foreground font-normal text-sm space-y-1">
                {MAIN_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSheet}
                    className="block hover:text-foreground hover:bg-muted transition-colors p-3 rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mengubah div ke button untuk aksesibilitas (a11y) */}
                <button
                  type="button"
                  className="flex items-center justify-between w-full cursor-pointer hover:text-foreground hover:bg-muted p-3 rounded-md transition-colors text-left"
                >
                  <span>Jelajahi Kategori</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="px-3 pt-3 pb-1 font-bold text-foreground">
                  Umum
                </div>

                {ACCOUNT_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSheet}
                    className="block hover:text-foreground hover:bg-muted transition-colors p-3 rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-border space-y-3 bg-background">
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/signout" onClick={closeSheet}>
                      Keluar
                    </Link>
                  }
                  variant="outline"
                  className="w-full font-bold h-11 text-base rounded-md"
                />
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
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3">
        <Input
          type="search"
          placeholder="Temukan Layanan"
          className="w-full h-10 border-input bg-background rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
