"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BuyerDesktopViewNavbar } from "./DesktopView";
import { BuyerMobileViewNavbar } from "./MobileView";

const CATEGORIES = [
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

function CategoriesNav() {
  return (
    <div className="container mx-auto px-4 relative flex items-center overflow-x-auto no-scrollbar py-2 text-sm text-muted-foreground whitespace-nowrap gap-6">
      {CATEGORIES.map((category, index) => (
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
  );
}

export function BuyerNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <BuyerMobileViewNavbar />
      <BuyerDesktopViewNavbar />
      <Separator />
      <CategoriesNav />
    </header>
  );
}
