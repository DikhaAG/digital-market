import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PopularKeyword } from "../_data/category";

interface PopularKeywordsProps {
  categoryName: string;
  items: PopularKeyword[];
}

export function PopularKeywords({ categoryName, items }: PopularKeywordsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Paling populer di {categoryName}
        </h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex w-max space-x-2.5 p-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const searchSlug = item.label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-");

            return (
              <Link
                key={idx}
                href={`/search?q=${searchSlug}`}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-brand/80 hover:bg-brand/5 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className="rounded-md bg-muted p-1.5 text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
