import React from "react";
import { HomeNavbar } from "./_components/HomeNavbar";
import { Separator } from "@/components/ui/separator";
import { UserFooter } from "./_components/Footer";
import { CategoryNav } from "./_components/CategoryNav";
import { db } from "@/lib/db";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbCategories = await db.query.categories.findMany({
    where: {
      parentId: {
        isNull: true,
      },
    },
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  const categoryLinks: FooterLink[] = dbCategories.map((cat) => ({
    label: cat.name,
    href: `/categories/${cat.slug}`,
  }));

  const footerSections: FooterSection[] = [
    {
      title: "Categories",
      links: categoryLinks,
    },
    {
      title: "Company",
      links: [
        { label: "About Fiverr", href: "/about" },
        { label: "Help Center", href: "/help" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Partnerships", href: "/partnerships" },
        { label: "Creator Network", href: "/creator-network" },
        { label: "Affiliates", href: "/affiliates" },
        { label: "Invite a Friend", href: "/referral" },
        { label: "Press & News", href: "/press" },
        { label: "Investor Relations", href: "/investors" },
      ],
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <HomeNavbar />
        {/* Sembunyikan Separator di mobile agar tidak bertumpuk dengan border header */}
        <Separator className="hidden md:block" />
        <CategoryNav />
      </header>
      <main className="flex-1 px-3 py-6 lg:px-22">{children}</main>
      <UserFooter sections={footerSections} />
    </div>
  );
}
