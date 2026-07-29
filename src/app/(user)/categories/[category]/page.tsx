import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CATEGORIES } from "@/features/user/layout/nav/data/categories";
import {
  POPULAR_KEYWORDS,
  EXPLORE_GRID_DATA,
} from "@/features/user/category/data/category";

import { CategoryHero } from "@/features/user/category/components/hero";
import { PopularKeywords } from "@/features/user/category/components/popular-keywords";
import { ExploreGrid } from "@/features/user/category/components/explore-grid";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.id === categorySlug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Services | Fiverr Clone`,
    description: `Find top freelance services in ${category.name}. Outsource your project today!`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = CATEGORIES.find((c) => c.id === categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full space-y-12 pb-16">
      <CategoryHero categoryName={category.name} />
      <PopularKeywords categoryName={category.name} items={POPULAR_KEYWORDS} />
      <ExploreGrid
        categoryName={category.name}
        categorySlug={categorySlug}
        gridData={EXPLORE_GRID_DATA}
      />
    </div>
  );
}
