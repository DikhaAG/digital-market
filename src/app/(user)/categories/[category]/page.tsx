import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { db } from "@/lib/db";
import { CategoryHero } from "./_components/hero";
import { ExploreGrid } from "./_components/explore-grid";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
  React cache() memastikan query ke database hanya dieksekusi 1 kali 
  meskipun dipanggil di generateMetadata & CategoryPage bersamaan.
 */
const getCategoryBySlug = cache(async (slug: string) => {
  return await db.query.categories.findFirst({
    where: {
      AND: [
        { slug },
        {
          parentId: {
            isNull: true,
          },
        },
      ],
    },
    with: {
      subcategories: {
        orderBy: (sub, { asc }) => [asc(sub.name)],
      },
    },
  });
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Services | Fiverr Clone`,
    description: `Find top freelance services in ${category.name}. Outsource your project today!`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full space-y-12 pb-16">
      <CategoryHero categoryName={category.name} />
      <ExploreGrid
        categoryName={category.name}
        categorySlug={category.slug}
        subcategories={category.subcategories ?? []}
      />
    </div>
  );
}
