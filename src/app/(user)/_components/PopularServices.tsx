import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CarouselWrapper } from "./CarouselWrapper";

export async function PopularServices() {
  const subcategories = await db.query.categories.findMany({
    where: {
      parentId: { isNotNull: true },
    },
    with: {
      parent: true,
    },
    limit: 12,
  });

  if (!subcategories || subcategories.length === 0) return null;

  return (
    <section
      className="w-full space-y-4"
      aria-labelledby="popular-services-heading"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2
          id="popular-services-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          Popular services
        </h2>
      </div>

      {/* Interactive Carousel */}
      <CarouselWrapper>
        {subcategories.map((sub, index) => {
          const href = sub.parent
            ? `/categories/${sub.parent.slug}/${sub.slug}`
            : `/categories/${sub.slug}`;

          return (
            <Link
              key={sub.id}
              href={href}
              /* 
                ✅ Murni preset shadcn:
                - bg-sidebar-primary: Warna utama padat untuk kartu aksen
                - text-sidebar-primary-foreground: Kontras teks otomatis
                - border-sidebar-border & ring: Bawaan preset
              */
              className="group relative flex flex-col justify-between shrink-0 snap-start w-[170px] sm:w-[200px] h-[245px] sm:h-[270px] bg-sidebar-primary text-sidebar-primary-foreground rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none"
            >
              {/* Judul Sub-Kategori */}
              <div className="px-1 pt-0.5">
                <h3 className="font-extrabold text-sidebar-primary-foreground text-base sm:text-lg leading-snug tracking-tight line-clamp-2">
                  {sub.name}
                </h3>
              </div>

              {/* Container Gambar Sampul */}
              <div className="relative w-full h-[140px] sm:h-[165px] rounded-xl sm:rounded-2xl overflow-hidden bg-black/20">
                {sub.image ? (
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 170px, 200px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  /* ✅ Fallback visual menggunakan preset shadcn: bg-muted & text-muted-foreground */
                  <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center p-3 text-center text-xs font-bold text-muted-foreground">
                    {sub.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </CarouselWrapper>
    </section>
  );
}
