//src/app/(user)/_components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FooterSection } from "../layout";
import type { BrandLogoConfig } from "@/server/services/settings.service";

interface UserFooterProps {
  sections: FooterSection[];
  brandLogo?: BrandLogoConfig;
}

export function UserFooter({ sections, brandLogo }: UserFooterProps) {
  const currentYear = new Date().getFullYear();
  const brandName = brandLogo?.logoText || "";

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
        {/* 2. MOBILE LAYOUT (< md): Accordion                        */}
        {/* ========================================================= */}
        <div className="block md:hidden pb-6 border-b border-border">
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
        {/* 3. BOTTOM FOOTER: Logo & Copyright                        */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-xs text-muted-foreground pt-6 md:pt-0">
          {/* Logo & Copyright Dinamis */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <Link href="/" className="flex items-center">
              {brandLogo?.logoType === "image" && brandLogo.logoImage ? (
                <Image
                  src={brandLogo.logoImage}
                  alt={brandName}
                  width={100}
                  height={30}
                  className="h-7 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="font-black text-2xl md:text-xl tracking-tight text-foreground">
                  {brandName}
                  <span className="text-primary">
                    {brandLogo?.logoTextAccent ?? "."}
                  </span>
                </span>
              )}
            </Link>

            <span>
              © {brandName.charAt(0).toUpperCase() + brandName.slice(1)}{" "}
              International Ltd. {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
