import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BuyerNavbarLogo } from "../Logo";

export function GuestDesktopViewNavbar() {
  return (
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
          render={<Link href="/register">Join</Link>}
          nativeButton={false}
          size="sm"
          className="font-bold px-5 h-9 rounded-md"
        ></Button>
      </div>
    </div>
  );
}
