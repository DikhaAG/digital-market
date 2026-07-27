import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHeroProps {
  categoryName: string;
}

export function CategoryHero({ categoryName }: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-green-900 to-zinc-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
      <div className="relative z-10 max-w-2xl space-y-4">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/20 text-emerald-300 backdrop-blur-sm px-3 py-1 text-xs gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Verified Freelancers
        </Badge>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {categoryName}
        </h1>
        <p className="text-emerald-100/80 text-base sm:text-lg">
          Your vision. Built by world-class developers and tech experts.
        </p>
      </div>

      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
    </section>
  );
}
