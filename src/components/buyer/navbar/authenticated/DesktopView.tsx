import { Input } from "@/components/ui/input";
import { BuyerNavbarLogo } from "@/components/buyer/navbar/Logo";
import { Button } from "@/components/ui/button";
import { Bell, Heart, Mail, Search } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthenticatedDesktopViewNavbar() {
  return (
    <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 md:gap-8">
      <BuyerNavbarLogo />

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
  );
}
