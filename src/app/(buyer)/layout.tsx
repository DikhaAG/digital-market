import React from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Mail,
  Heart,
  ChevronRight,
  Globe,
  Accessibility,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

// Data Link Footer (5 Kolom)
const footerSections = [
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "AI Services",
      "Consulting",
      "Data",
      "Business",
      "Personal Growth & Hobbies",
      "Photography",
      "Finance",
      "End-to-End Projects",
      "Service Catalog",
    ],
  },
  {
    title: "For Clients",
    links: [
      "How Fiverr Works",
      "Customer Success Stories",
      "Quality Guide",
      "Fiverr Guides",
      "Fiverr Answers",
      "Browse Freelance By Skill",
    ],
  },
  {
    title: "For Freelancers",
    links: [
      "Become a Fiverr Freelancer",
      "Become an Agency",
      "Community Hub",
      "Forum",
      "Events",
    ],
  },
  {
    title: "Business Solutions",
    links: [
      "Fiverr Pro",
      "Project Management Service",
      "Expert Sourcing Service",
      "AutoDS - Dropshipping Tool",
      "Digis - Software Development",
      "AI store builder",
      "Fiverr Logo Maker",
      "Contact Sales",
    ],
  },
  {
    title: "Company",
    links: [
      "About Fiverr",
      "Help Center",
      "Trust & Safety",
      "Social Impact",
      "Careers",
      "Terms of Service",
      "Privacy Policy",
      "Do not sell or share my personal information",
      "Partnerships",
      "Creator Network",
      "Affiliates",
      "Invite a Friend",
      "Press & News",
      "Investor Relations",
    ],
  },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* ================= FIXED TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Row 1: Logo, Search, Actions */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">{children}</main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border bg-background pt-12 pb-6 text-sm">
        <div className="container mx-auto px-4">
          {/* Top Footer: Multi-column Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
            {footerSections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-bold text-foreground">{section.title}</h4>
                <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href="#"
                        className="hover:underline hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Bottom Footer: Logo, Copyright & Preferences */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            {/* Logo + Copyright */}
            <div className="flex items-center gap-3">
              <span className="font-black text-xl tracking-tight text-foreground">
                fiverr<span className="text-emerald-500">.</span>
              </span>
              <span>© Fiverr International Ltd. 2026</span>
            </div>

            {/* Social Icons & Region Controls */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Regional Preferences */}
              <div className="flex items-center gap-3 font-semibold">
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                </button>
                <button className="hover:text-foreground transition-colors">
                  $ USD
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Accessibility className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
