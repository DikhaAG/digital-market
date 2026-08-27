//src/app/(user)/gigs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Star, ShieldCheck, User as UserIcon } from "lucide-react";
import { trpcServer } from "@/lib/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  // Type Guard: jika gig, seller, atau category tidak ditemukan
  if (!gig || !gig.seller || !gig.category) {
    notFound();
  }

  const { seller, category, packages } = gig;

  // Membangun array breadcrumbs sesuai hirarki induk & anak kategori
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

            {/**
            <div className="flex items-center gap-3 pt-2">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src={seller.image ?? ""} alt={seller.name} />
                <AvatarFallback>
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    {seller.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] gap-1 px-2 py-0"
                  >
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Verified Seller
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground">5.0</span>
                  <span>(100+ Ulasan)</span>
                </div>
              </div>
            </div>
            **/}
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

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Tentang Layanan Ini
            </h2>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {gig.about || "Tidak ada deskripsi rinci untuk layanan ini."}
            </div>
          </section>

          {/**
          <section className="space-y-4 p-6 rounded-2xl border border-border bg-card">
            <h2 className="text-lg font-bold text-foreground">
              Tentang Penjual
            </h2>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarImage src={seller.image ?? ""} alt={seller.name} />
                <AvatarFallback>
                  <UserIcon className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">
                  {seller.name}
                </h3>
                <p className="text-xs text-muted-foreground">{seller.email}</p>
                <p className="text-xs text-muted-foreground pt-1">
                  Bergabung sejak{" "}
                  {new Date(seller.createdAt).toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </section>
          **/}
        </div>

        <div className="lg:col-span-4">
          <PackageTabs packages={packages} sellerName={seller.name} />
        </div>
      </div>
    </div>
  );
}
