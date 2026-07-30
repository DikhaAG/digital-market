"use client";

import { Separator } from "@/components/ui/separator";

import { CategoriesNav } from "./Categories";
import { GuestNavbar } from "./guest/GuestNavbar";

export function UserNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <GuestNavbar />
      <Separator />
      <CategoriesNav />
    </header>
  );
}
