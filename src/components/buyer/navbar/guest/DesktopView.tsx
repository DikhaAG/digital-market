import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyerNavbarLogo } from "../Logo";

export function GuestDesktopViewNavbar() {
  return (
    <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4">
      <BuyerNavbarLogo />

      {/* Nav Right Links & Actions */}
      <div className="flex items-center gap-6 text-sm font-bold text-foreground">
        <button
          type="button"
          className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
        >
          Fiverr Pro <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
        >
          Explore <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>EN</span>
        </button>

        <Link
          href="/become-seller"
          className="hover:text-emerald-500 transition-colors"
        >
          Become a Seller
        </Link>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-border my-auto" />

        <Link
          href="/login"
          className="hover:text-emerald-500 transition-colors"
        >
          Sign in
        </Link>

        <Button asChild size="sm" className="font-bold px-5 h-9 rounded-md">
          <Link href="/register">Join</Link>
        </Button>
      </div>
    </div>
  );
}
