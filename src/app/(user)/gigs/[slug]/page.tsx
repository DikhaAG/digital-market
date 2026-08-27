// src/app/(user)/gigs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trpcServer } from "@/lib/trpc/server";
import { PackageTabs } from "./_components/PackageTabs";
import { CategoryBreadcrumbs } from "@/components/navigations/CategoryBreadcrumbs";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trpc = await trpcServer();
  const gig = await trpc.gig.getBySlug({ slug });

  if (!gig || !gig.seller) {
    return { title: "Gig Not Found" };
  }

  return {
    title: `${gig.title} | ${gig.seller.name}`,
    description:
      gig.about?.slice(0, 160) ??
      `Pesan jasa ${gig.title} dari seller terverifikasi.`,
    openGraph: {
      title: gig.title,
      description: gig.about ?? "",
      images: gig.coverImage ? [{ url: gig.coverImage }] : [],
    },
  };
}

export default async function GigDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const trpc = await trpcServer();
  const gig = await trpc.gig.getBySlug({ slug });

  if (!gig || !gig.seller || !gig.category) {
    notFound();
  }

  const { seller, category, packages } = gig;

  const breadcrumbItems = [
    ...(category.parent
      ? [
          {
            label: category.parent.name,
            href: `/categories/${category.parent.slug}`,
          },
        ]
      : []),
    {
      label: category.name,
      href: category.parent
        ? `/categories/${category.parent.slug}/${category.slug}`
        : `/categories/${category.slug}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Integrated Unified Breadcrumb Component */}
      <CategoryBreadcrumbs items={breadcrumbItems} />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
              {gig.title}
            </h1>
          </div>

          <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
            {gig.coverImage ? (
              <Image
                src={gig.coverImage}
                alt={gig.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No Cover Image
              </div>
            )}
          </div>

          {/* SECTION DESKRIPSI UTAMA (GIG.ABOUT) */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Tentang Layanan Ini
            </h2>

            {/* Rich Text Formatted Render */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed prose-p:my-3 prose-strong:text-foreground prose-strong:font-bold prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 text-foreground/90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {gig.about || "Tidak ada deskripsi rinci untuk layanan ini."}
              </ReactMarkdown>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <PackageTabs packages={packages} sellerName={seller.name} />
        </div>
      </div>
    </div>
  );
}
