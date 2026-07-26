"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Mail,
  Heart,
  ChevronRight,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Data Navigasi Kategori (Row 2 Navbar)
const categories = [
  { name: "Trending 🔥", href: "/categories/trending" },
  { name: "Graphics & Design", href: "/categories/graphics-design" },
  { name: "Programming & Tech", href: "/categories/programming-tech" },
  { name: "Digital Marketing", href: "/categories/digital-marketing" },
  { name: "Video & Animation", href: "/categories/video-animation" },
  { name: "Writing & Translation", href: "/categories/writing-translation" },
  { name: "Music & Audio", href: "/categories/music-audio" },
  { name: "Business", href: "/categories/business" },
  { name: "Finance", href: "/categories/finance" },
];

export function BuyerNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah error portal SSR di browser mobile
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* ------------ MOBILE NAVBAR ------------ */}
      <div className="flex flex-col md:hidden">
        {/* Header Bar Top (Hamburger + Centered Logo) */}
        <div className="flex items-center justify-between px-4 h-14">
          {/* Dummy Box untuk Menjaga Alignment Center Logo */}
          <div className="w-8" />

          {/* Logo Center */}
          <Link
            href="/"
            className="flex items-center gap-0.5 text-2xl font-black tracking-tight text-foreground"
          >
            fiverr
            <span className="text-emerald-500 text-3xl leading-none">.</span>
          </Link>

          {/* Render Sheet hanya jika client sudah mounted */}
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent active:bg-accent transition-colors cursor-pointer touch-manipulation select-none"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>

              {/* Mobile Sidebar Content */}
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
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/inbox"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Inbox
                  </Link>
                  <Link
                    href="/post-brief"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Post a project brief
                  </Link>
                  <Link
                    href="/briefs"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Briefs
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Manage Orders
                  </Link>
                  <Link
                    href="/lists"
                    onClick={() => setOpen(false)}
                    className="block hover:text-foreground transition-colors"
                  >
                    Lists
                  </Link>

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

        {/* Search Input Bar Mobile */}
        <div className="px-4 pb-3">
          <Input
            type="search"
            placeholder="Find services"
            className="w-full h-10 border-input bg-background rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* ------------ DESKTOP NAVBAR ------------ */}
      <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-0.5 text-2xl font-black tracking-tight shrink-0 text-foreground"
        >
          fiverr
          <span className="text-emerald-500 text-3xl leading-none">.</span>
        </Link>

        {/* Search Bar */}
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

        {/* Nav Right Actions */}
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
            <Mail className="h-5 w-5" />
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
            className="text-sm font-semibold text-muted-foreground hover:text-foreground hidden sm:block px-2"
          >
            Orders
          </Link>

          {/* User Avatar with Status Indicator */}
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                M
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Row 2: Categories Sub-Navbar */}
      <div className="container mx-auto px-4 relative flex items-center overflow-x-auto no-scrollbar py-2 text-sm text-muted-foreground whitespace-nowrap gap-6">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="hover:text-foreground transition-colors py-1 shrink-0"
          >
            {category.name}
          </Link>
        ))}
        <div className="sticky right-0 bg-gradient-to-l from-background via-background/90 to-transparent pl-6 pr-2 flex items-center shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
