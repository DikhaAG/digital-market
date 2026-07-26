import { CATEGORIES } from "@/config/buyer/categories-nav";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CategoriesNav() {
  return (
    <div className="container mx-auto px-4 relative flex items-center overflow-x-auto no-scrollbar py-2 text-sm text-muted-foreground whitespace-nowrap gap-6">
      {CATEGORIES.map((category, index) => (
        <Link
          key={index}
          href={category.href}
          className="hover:text-foreground transition-colors py-1 shrink-0"
        >
          {category.name}
        </Link>
      ))}
      <div className="sticky right-0 bg-gradient-to-l from-background via-background/90 to-transparent pl-6 pr-2 flex items-center shrink-0">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
