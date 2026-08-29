// src/app/(user)/gigs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check } from "lucide-react";
import { trpcServer } from "@/lib/trpc/server";
import { PackageTabs } from "./_components/PackageTabs";
import { CategoryBreadcrumbs } from "@/components/navigations/CategoryBreadcrumbs";
import { cn } from "@/lib/utils";
import { SettingsService } from "@/server/services/settings.service";

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
  const [gig, adminContact] = await Promise.all([
    trpc.gig.getBySlug({ slug }),
    SettingsService.getAdminContactCached(),
  ]);

  if (!gig || !gig.seller || !gig.category) {
    notFound();
  }

  const { seller, category, packages, gigAttributes } = gig;

  // --------------------------------------------------------------------------
  // 1. OLAHKAN ATRIBUT (gigAttributeOptions) BERDASARKAN INDUK ATRIBUT
  // --------------------------------------------------------------------------
  const attributeMap = new Map<string, string[]>();

  gigAttributes?.forEach((ga) => {
    const attrName = ga.option?.attribute?.name;
    const optionLabel = ga.option?.label;

    if (attrName && optionLabel) {
      const existing = attributeMap.get(attrName) || [];
      attributeMap.set(attrName, [...existing, optionLabel]);
    }
  });

  // --------------------------------------------------------------------------
  // 2. MENGURUTKAN DAN MENSTRUKTURKAN PAKET (Basic -> Standard -> Premium)
  // --------------------------------------------------------------------------
  const packageOrder = ["basic", "standard", "premium"] as const;
  const sortedPackages = packageOrder
    .map((type) => packages?.find((p) => p.packageType.toLowerCase() === type))
    .filter(Boolean) as typeof packages;

  // --------------------------------------------------------------------------
  // 3. OLAHKAN DAFTAR FITUR PAKET DARI gigPackageFeatureValues
  // --------------------------------------------------------------------------
  const featureMap = new Map<
    string,
    {
      id: string;
      name: string;
      type: "boolean" | "text" | "number";
      values: Record<
        string,
        { isIncluded: boolean | null; value: string | null }
      >;
    }
  >();

  packages?.forEach((pkg) => {
    pkg.featureValues?.forEach((fv) => {
      if (!fv.feature) return;

      if (!featureMap.has(fv.feature.id)) {
        featureMap.set(fv.feature.id, {
          id: fv.feature.id,
          name: fv.feature.name,
          type: fv.feature.type,
          values: {},
        });
      }

      const feat = featureMap.get(fv.feature.id)!;
      feat.values[pkg.packageType.toLowerCase()] = {
        isIncluded: fv.isIncluded,
        value: fv.value,
      };
    });
  });

  const packageFeaturesList = Array.from(featureMap.values());

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

          {/* SECTION METADATA / ATRIBUT GIG */}
          {attributeMap.size > 0 && (
            <section className="pt-8 border-t border-border/80">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {Array.from(attributeMap.entries()).map(
                  ([attrName, options]) => (
                    <div key={attrName} className="space-y-1.5">
                      <h3 className="text-sm font-normal text-muted-foreground">
                        {attrName}
                      </h3>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {options.join(", ")}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* SECTION COMPARE PACKAGES (Sesuai Tampilan Gambar) */}
          {sortedPackages.length > 0 && (
            <section className="pt-8 border-t border-border/80 space-y-6">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Compare packages
              </h2>

              <div className="overflow-x-auto rounded-2xl border border-border/80 bg-background shadow-xs no-scrollbar">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/80">
                      <th className="w-1/4 p-4 align-top font-normal text-muted-foreground text-xs uppercase tracking-wider">
                        Package
                      </th>
                      {sortedPackages.map((pkg) => (
                        <th
                          key={pkg.id}
                          className="w-1/4 p-4 align-top space-y-2 border-l border-border/60"
                        >
                          <div className="text-xl font-bold text-foreground">
                            ${pkg.price.toLocaleString("en-US")}
                          </div>
                          <div className="text-base font-bold text-foreground capitalize">
                            {pkg.title || pkg.packageType}
                          </div>
                          {pkg.description && (
                            <p className="text-xs font-normal text-muted-foreground leading-relaxed">
                              {pkg.description}
                            </p>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* BARIS FITUR DINAMIS DARI CATEGORY PACKAGE FEATURES */}
                    {packageFeaturesList.map((feature, idx) => (
                      <tr
                        key={feature.id}
                        className={cn(
                          "border-b border-border/40 transition-colors",
                          idx % 2 === 1 && "bg-muted/20",
                        )}
                      >
                        <td className="p-4 font-normal text-muted-foreground text-xs sm:text-sm">
                          {feature.name}
                        </td>
                        {sortedPackages.map((pkg) => {
                          const pType = pkg.packageType.toLowerCase();
                          const valData = feature.values[pType];

                          return (
                            <td
                              key={pkg.id}
                              className="p-4 border-l border-border/60 align-middle text-center sm:text-left"
                            >
                              {feature.type === "boolean" ? (
                                valData?.isIncluded ? (
                                  <Check className="h-5 w-5 text-foreground inline-block" />
                                ) : (
                                  <Check className="h-5 w-5 text-muted-foreground/20 inline-block" />
                                )
                              ) : (
                                <span className="text-xs sm:text-sm font-semibold text-foreground">
                                  {valData?.value || "-"}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* BARIS REVISI */}
                    <tr className="border-b border-border/40 bg-muted/10">
                      <td className="p-4 font-normal text-muted-foreground text-xs sm:text-sm">
                        Revisions
                      </td>
                      {sortedPackages.map((pkg) => (
                        <td
                          key={pkg.id}
                          className="p-4 border-l border-border/60 text-xs sm:text-sm font-semibold text-foreground"
                        >
                          {pkg.revisions >= 99 ? "Unlimited" : pkg.revisions}
                        </td>
                      ))}
                    </tr>

                    {/* BARIS WAKTU PENGIRIMAN */}
                    <tr>
                      <td className="p-4 font-normal text-muted-foreground text-xs sm:text-sm">
                        Delivery Time
                      </td>
                      {sortedPackages.map((pkg) => (
                        <td
                          key={pkg.id}
                          className="p-4 border-l border-border/60 text-xs sm:text-sm font-semibold text-foreground"
                        >
                          {pkg.deliveryTimeDays} days
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-4">
          <PackageTabs
            packages={packages}
            sellerName={seller.name}
            adminPhoneNumber={adminContact.whatsappNumber}
          />
        </div>
      </div>
    </div>
  );
}
