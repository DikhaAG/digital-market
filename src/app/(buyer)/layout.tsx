import React from "react";
import Link from "next/link";
import { Globe, Accessibility } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BuyerNavbar } from "@/components/buyer/Navbar";

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
      <BuyerNavbar />

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
                <button className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Accessibility className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
