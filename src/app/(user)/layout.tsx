import React from "react";
import { HomeNavbar } from "./_components/HomeNavbar";
import { Separator } from "@/components/ui/separator";
import { UserFooter } from "./_components/Footer";
import { CategoryNav } from "./_components/CategoryNav";
import { db } from "@/lib/db";
import { BrandLogo } from "@/components/BrandLogo";
import { SettingsService } from "@/server/services/settings.service";

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
  const brandLogo = await SettingsService.getBrandLogoCached();
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
  ];

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <HomeNavbar logo={<BrandLogo />} />

        {/* BEST APPROACH: Kendalikan visibilitas navigasi kategori khusus desktop di sini */}
        <div className="hidden md:block">
          <Separator />
          <CategoryNav />
        </div>
      </header>

      <main className="flex-1 px-3 py-6 lg:px-22">{children}</main>
      <UserFooter sections={footerSections} brandLogo={brandLogo} />
    </div>
  );
}
