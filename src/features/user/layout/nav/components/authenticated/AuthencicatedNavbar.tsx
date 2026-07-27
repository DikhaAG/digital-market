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
import { NavbarSearchBar } from "../NavbarSearchBar";
import { UserAvatar } from "../UserAvatar";
import { NavLinksGroup } from "../NavLinksGroup";
import { CategoryAccordion } from "../CategoryAccordion";
import { UserNavbarLogo } from "../Logo";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 md:gap-8">
        <UserNavbarLogo />

        <div className="flex-1 max-w-2xl">
          <NavbarSearchBar variant="desktop" />
        </div>

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

          <UserAvatar user={user} size="sm" showBadge />
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="w-10 h-10" aria-hidden="true" />
          <UserNavbarLogo />

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
                <SheetHeader className="p-6 pb-4 text-left border-b border-border">
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="lg" />
                    <span className="font-bold text-base text-foreground">
                      {user.name}
                    </span>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-3 text-muted-foreground font-normal text-sm space-y-1">
                  <Link
                    href="/start-selling"
                    onClick={closeSheet}
                    className="flex gap-x-2 items-center font-bold text-lg text-brand hover:text-brand-hover hover:bg-muted transition-colors p-3 rounded-md"
                  >
                    Menjadi Penjual <Crown className="h-5 w-5" />
                  </Link>

                  <NavLinksGroup
                    links={MAIN_NAV_LINKS}
                    onLinkClick={closeSheet}
                  />

                  <CategoryAccordion onLinkClick={closeSheet} />

                  <NavLinksGroup
                    title="Umum"
                    links={ACCOUNT_NAV_LINKS}
                    onLinkClick={closeSheet}
                  />
                </div>

                <div className="p-6 bg-background border-t border-border">
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
          <NavbarSearchBar variant="mobile" />
        </div>
      </div>
    </div>
  );
}
