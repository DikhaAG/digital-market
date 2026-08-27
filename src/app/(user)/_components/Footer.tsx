//src/app/(user)/_components/Footer.tsx
"use client";

import Link from "next/link";
// import { Globe, Accessibility } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FooterSection } from "../layout";

interface UserFooterProps {
  sections: FooterSection[];
}

export function UserFooter({ sections }: UserFooterProps) {
  return (
    <footer className="border-t border-border bg-background pt-8 md:pt-12 pb-6 text-sm">
      <div className="container mx-auto px-4">
        {/* ========================================================= */}
        {/* 1. DESKTOP LAYOUT (>= md): Multi-column Grid              */}
        {/* ========================================================= */}
        <div className="hidden md:grid grid-cols-5 gap-8 pb-12">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-bold text-foreground">{section.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:underline hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 2. MOBILE LAYOUT (< md): Shadcn Accessible Accordion      */}
        {/* ========================================================= */}
        <div className="block md:hidden pb-6 border-b border-border">
          {/* ✅ FIXED: Menghapus prop render={...} yang merusak JSX */}
          <Accordion className="w-full">
            {sections.map((section) => (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger className="font-bold text-foreground text-base py-4 hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pb-2 space-y-3 text-sm text-muted-foreground">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block hover:text-foreground transition-colors py-0.5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Separator className="hidden md:block my-6" />

        {/* ========================================================= */}
        {/* 3. BOTTOM FOOTER: Logo, Copyright, Social & Regional    */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-xs text-muted-foreground pt-6 md:pt-0">
          {/* Logo & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <span className="font-black text-2xl md:text-xl tracking-tight text-foreground">
              fiverr<span className="text-primary">.</span>
            </span>
            <span>© Fiverr International Ltd. 2026</span>
          </div>

          {/* Regional & Accessibility Preferences 
          <div className="flex items-center justify-center gap-3 font-semibold">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <Globe className="h-4 w-4" />
              <span>English</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              $ USD
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Accessibility options"
            >
              <Accessibility className="h-4 w-4" />
            </Button>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
}
