import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BuyerNavbarLogo } from "./Logo";

const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Inbox", href: "/inbox" },
  { label: "Post a project brief", href: "/post-brief" },
  { label: "Briefs", href: "/briefs" },
  { label: "Manage Orders", href: "/orders" },
  { label: "Lists", href: "/lists" },
];

export function BuyerMobileViewNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col md:hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 h-14">
        {/* Placeholder penyeimbang posisi center logo */}
        <div className="w-8" />

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
                    <AvatarImage src="/avatar.png" alt="dikhaag" />
                    <AvatarFallback className="bg-amber-700 text-amber-50 font-semibold text-lg">
                      D
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-base text-foreground">
                    dikhaag
                  </span>
                </div>
              </SheetHeader>

              {/* Sidebar Navigation Items */}
              <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4 text-muted-foreground font-normal text-sm">
                {MOBILE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex items-center justify-between cursor-pointer py-1 hover:text-foreground transition-colors">
                  <span>Browse categories</span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between cursor-pointer py-1 hover:text-foreground transition-colors">
                  <span>Explore</span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <div className="pt-4">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block font-bold text-foreground"
                  >
                    My Profile
                  </Link>
                </div>

                <div className="pt-2">
                  <Link
                    href="/referral"
                    onClick={() => setOpen(false)}
                    className="block font-bold text-emerald-500 hover:underline"
                  >
                    Refer & Get up to $100
                  </Link>
                </div>
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
          placeholder="Find services"
          className="w-full h-10 border-input bg-background rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
