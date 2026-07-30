import Link from "next/link";
import { db } from "@/lib/db";
import { CategoryIcon } from "@/components/CategoryIcon";

export async function CategoryCards() {
  // Fetch kategori utama (parentId IS NULL) langsung di server (RSC)
  const categories = await db.query.categories.findMany({
    where: {
      parentId: {
        isNull: true,
      },
    },
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full">
      {/* 
        - Horizontal Scroll di Mobile (no-scrollbar)
        - Flexible Grid di Desktop (tergantung jumlah kategori)
      */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 sm:overflow-visible">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex flex-col justify-between p-4 h-[135px] min-w-[130px] sm:min-w-0 sm:w-full bg-card rounded-2xl border border-border/60 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-border hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* 1. Icon Bagian Atas */}
            <div className="text-foreground group-hover:text-primary transition-colors">
              <CategoryIcon
                name={category.icon}
                className="h-7 w-7 stroke-[1.5]"
              />
            </div>

            {/* 2. Judul Bagian Bawah */}
            <span className="font-bold text-xs sm:text-sm leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
