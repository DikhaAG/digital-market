import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHeroProps {
  categoryName: string;
}

export function CategoryHero({ categoryName }: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-background text-foreground p-6 sm:p-10 lg:p-12 shadow-md border border-primary/15">
      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <li
              className="text-primary font-semibold truncate"
              aria-current="page"
            >
              {categoryName}
            </li>
          </ol>
        </nav>

        {/* Badge & Title */}
        <div className="space-y-3">
          <Badge
            variant="outline"
            className="border-primary/25 bg-primary/10 text-primary backdrop-blur-md px-3 py-1 text-xs font-medium gap-1.5 rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            Freelancers Terverifikasi
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {categoryName}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
            Find specialized talent, hire top-rated experts, and scale your
            project with trusted professionals in {categoryName}.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-border/40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>1,000+ Produk Digital</span>
          </div>
          <div>•</div>
          <div>4.9/5 Average Rating</div>
        </div>
      </div>

      {/* Decorative Glow Shapes (Primary Accent Glow) */}
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/2 bottom-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
    </section>
  );
}
