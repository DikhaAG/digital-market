import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PopularKeyword } from "../data/category";

interface PopularKeywordsProps {
  categoryName: string;
  items: PopularKeyword[];
}

export function PopularKeywords({ categoryName, items }: PopularKeywordsProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Most Popular in {categoryName}
      </h2>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex w-max space-x-3 p-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Button
                key={idx}
                variant="outline"
                className="h-auto py-2.5 px-4 rounded-xl border-border bg-card hover:border-emerald-500 hover:shadow-md transition-all gap-3 group"
              >
                <div className="rounded-lg bg-muted p-1.5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
