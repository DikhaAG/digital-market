import Link from "next/link";
import { Globe, Accessibility } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FOOTER_SECTIONS } from "@/config/buyer/nav/footer-nav";

export function BuyerFooter() {
  return (
    <footer className="border-t border-border bg-background pt-12 pb-6 text-sm">
      <div className="container mx-auto px-4">
        {/* Top Footer: Multi-column Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-bold text-foreground">{section.title}</h4>
              <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground">
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
            <div className="flex items-center gap-2 font-semibold">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
