import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExploreGridItem } from "../data/category";

interface ExploreGridProps {
  categoryName: string;
  categorySlug: string;
  gridData: ExploreGridItem[];
}

export function ExploreGrid({
  categoryName,
  categorySlug,
  gridData,
}: ExploreGridProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Explore {categoryName}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gridData.map((card, idx) => (
          <Card
            key={idx}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-emerald-500/50 flex flex-col justify-between"
          >
            <CardHeader
              className={`h-28 bg-gradient-to-br ${card.bgGradient} p-4 text-white justify-end space-y-0.5`}
            >
              <CardTitle className="font-bold text-lg leading-tight group-hover:translate-x-0.5 transition-transform">
                {card.title}
              </CardTitle>
              <p className="text-xs text-zinc-300 truncate font-normal">
                {card.desc}
              </p>
            </CardHeader>

            <CardContent className="p-4 flex-1">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {card.items.map((item, itemIdx) => {
                  const subSlug = item
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-");
                  return (
                    <li key={itemIdx}>
                      <Link
                        href={`/categories/${categorySlug}/${subSlug}`}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors block text-xs sm:text-sm font-medium"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
