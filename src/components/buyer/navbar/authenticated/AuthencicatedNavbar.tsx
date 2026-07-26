"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Heart, Menu, Search, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BuyerNavbarLogo } from "@/components/buyer/navbar/Logo";
import { ACCOUNT_NAV_LINKS, MAIN_NAV_LINKS } from "@/config/buyer/nav/links";

interface UserProfile {
  name: string;
  avatarUrl?: string;
}

interface AuthenticatedNavbarProps {
  user?: UserProfile;
}

export function AuthenticatedNavbar({
  user = { name: "dikhaag", avatarUrl: "/avatar.png" },
}: AuthenticatedNavbarProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah mismatch hydration saat render Sheet di Server vs Client
  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);
  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 md:gap-8">
        <BuyerNavbarLogo />

        {/* Search Bar Desktop */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center w-full border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            <Input
              type="search"
              placeholder="What service are you looking for today?"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 px-4 text-sm bg-transparent"
            />
            <Button
              size="icon"
              className="rounded-none h-10 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions & Profile Desktop */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Link
            href="/orders"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-2"
          >
            Orders
          </Link>

          {/* User Avatar Desktop */}
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                {initialLetter}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="flex flex-col md:hidden">
        {/* Top Header Bar Mobile */}
        <div className="flex items-center justify-between px-4 h-14">
          {/* Spacer penyeimbang layout logo */}
          <div className="w-10 h-10" aria-hidden="true" />

          <BuyerNavbarLogo />

          {/* Sheet Drawer Navigation */}
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
              ></SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] p-0 flex flex-col"
              >
                <SheetHeader className="p-6 pb-4  text-left">
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-lg">
                        {initialLetter}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-base text-foreground">
                      {user.name}
                    </span>
                  </div>
                </SheetHeader>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto p-3 text-muted-foreground font-normal text-sm space-y-1">
                  <Link
                    href="/start-selling"
                    onClick={closeSheet}
                    className="flex gap-x-2 items-center font-bold text-lg text-brand hover:text-brand-hover hover:bg-muted transition-colors p-3 rounded-md"
                  >
                    Menjadi Penjual <Crown className="h-5 w-5" />
                  </Link>
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
                <div className="p-6  bg-background">
                  <Button
                    variant="outline"
                    className="w-full font-bold h-11 text-base rounded-md"
                  >
                    <Link href="/signout" onClick={closeSheet}>
                      Keluar
                    </Link>
                  </Button>
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

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3">
          <Input
            type="search"
            placeholder="Temukan Layanan"
            className="w-full h-10 border-input bg-background rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
