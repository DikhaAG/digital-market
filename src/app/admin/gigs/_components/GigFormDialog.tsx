"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { gigFormSchema, type GigFormValues } from "@/lib/validations/gig";
import { Plus, Loader2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface GigFormDialogProps {
  gigId?: string;
  trigger?: React.ReactNode;
}

export function GigFormDialog({ gigId, trigger }: GigFormDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  // 1. Query Meta & Helpers
  const { data: sellers } = trpc.admin.getAllSellers.useQuery(undefined, {
    enabled: open,
  });
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery(
    undefined,
    {
      enabled: open,
    },
  );
  const { data: gigDetail, isLoading: isLoadingDetail } =
    trpc.admin.getGigDetail.useQuery(
      { id: gigId! },
      { enabled: open && !!gigId },
    );

  // 2. React Hook Form Instance
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      about: "",
      coverImage: "",
      attributeOptionIds: [],
      packages: [
        {
          packageType: "basic",
          title: "Basic Pack",
          description: "Starter features",
          price: 25,
          deliveryTimeDays: 3,
          revisions: 1,
          featureValues: [],
        },
        {
          packageType: "standard",
          title: "Standard Pack",
          description: "Most popular choice",
          price: 50,
          deliveryTimeDays: 2,
          revisions: 3,
          featureValues: [],
        },
        {
          packageType: "premium",
          title: "Premium Pack",
          description: "Complete solution",
          price: 100,
          deliveryTimeDays: 1,
          revisions: 99,
          featureValues: [],
        },
      ],
    },
  });

  const selectedCategoryId = watch("categoryId");
  const titleValue = watch("title");

  // Query Dynamic Meta Attributes & Features berdasarkan Kategori terpilih
  const { data: catMeta } = trpc.admin.getCategoryGigMeta.useQuery(
    { categoryId: selectedCategoryId },
    { enabled: !!selectedCategoryId },
  );

  // Auto Generate Slug saat Title Diisi
  useEffect(() => {
    if (titleValue && !gigId) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, setValue, gigId]);

  // Load Data awal saat Edit Mode
  useEffect(() => {
    if (gigDetail && open) {
      reset({
        id: gigDetail.id,
        sellerId: gigDetail.sellerId,
        categoryId: gigDetail.categoryId,
        title: gigDetail.title,
        slug: gigDetail.slug,
        about: gigDetail.about ?? "",
        coverImage: gigDetail.coverImage ?? "",
        attributeOptionIds: gigDetail.gigAttributes.map(
          (ga) => ga.attributeOptionId,
        ),
        packages: gigDetail.packages.map((pkg) => ({
          packageType: pkg.packageType as "basic" | "standard" | "premium",
          title: pkg.title,
          description: pkg.description ?? "",
          price: pkg.price,
          deliveryTimeDays: pkg.deliveryTimeDays,
          revisions: pkg.revisions,
          featureValues: pkg.featureValues.map((fv) => ({
            packageFeatureId: fv.packageFeatureId,
            isIncluded: fv.isIncluded ?? false,
            value: fv.value ?? "",
          })),
        })),
      });
    }
  }, [gigDetail, open, reset]);

  // Upsert Mutation
  const upsertMutation = trpc.admin.upsertGig.useMutation({
    onSuccess: () => {
      utils.admin.getGigsForAudit.invalidate();
      reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: GigFormValues) => {
    upsertMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="font-semibold gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Buat Gig Baru
            </Button>
          )
        }
      />
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {gigId ? "Edit & Update Gig" : "Publikasikan Gig Baru"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDetail && gigId ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted h-10 p-1 w-full justify-start">
                <TabsTrigger value="overview" className="text-xs font-bold">
                  1. Overview & Category
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  disabled={!selectedCategoryId}
                  className="text-xs font-bold"
                >
                  2. Dynamic Attributes
                </TabsTrigger>
                <TabsTrigger
                  value="packages"
                  disabled={!selectedCategoryId}
                  className="text-xs font-bold"
                >
                  3. Pricing Packages Matrix
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: OVERVIEW & CATEGORY */}
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Seller Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Seller / Freelancer
                    </label>
                    <select
                      {...register("sellerId")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">-- Pilih Seller --</option>
                      {sellers?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.email})
                        </option>
                      ))}
                    </select>
                    {errors.sellerId && (
                      <p className="text-xs text-destructive">
                        {errors.sellerId.message}
                      </p>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Sub-Kategori Layanan
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">-- Pilih Sub-Kategori --</option>
                      {categoryTree?.map((parent) => (
                        <optgroup key={parent.id} label={parent.name}>
                          {parent.subcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-xs text-destructive">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Judul Layanan (Gig Title)
                  </label>
                  <Input
                    placeholder="Contoh: I will build a modern fullstack web application"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      URL Slug
                    </label>
                    <Input
                      placeholder="modern-fullstack-app"
                      {...register("slug")}
                    />
                    {errors.slug && (
                      <p className="text-xs text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Cover Image URL
                    </label>
                    <Input
                      placeholder="https://cdn.example.com/cover.jpg"
                      {...register("coverImage")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    About This Gig (Deskripsi Lengkap)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Jelaskan detail keahlian, teknologi, dan alur kerja layanan Anda..."
                    {...register("about")}
                    className="w-full p-3 rounded-md border border-input bg-background text-sm"
                  />
                </div>
              </TabsContent>

              {/* TAB 2: DYNAMIC FILTER ATTRIBUTES */}
              <TabsContent value="attributes" className="space-y-4 pt-4">
                {catMeta?.attributes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-6 text-center">
                    Tidak ada atribut khusus untuk kategori ini. Anda dapat
                    langsung menuju ke pembuatan Paket.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Pilih karakteristik filter yang sesuai dengan Gig ini agar
                      mudah ditemukan dalam pencarian:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catMeta?.attributes.map((attr) => (
                        <div
                          key={attr.id}
                          className="p-3.5 rounded-xl border border-border bg-card space-y-2"
                        >
                          <span className="font-bold text-xs text-foreground block">
                            {attr.name}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {attr.options.map((opt) => {
                              const currentOptions: string[] =
                                watch("attributeOptionIds") || [];
                              const isChecked = currentOptions.includes(opt.id);

                              return (
                                <button
                                  type="button"
                                  key={opt.id}
                                  onClick={() => {
                                    if (isChecked) {
                                      setValue(
                                        "attributeOptionIds",
                                        currentOptions.filter(
                                          (id) => id !== opt.id,
                                        ),
                                      );
                                    } else {
                                      setValue("attributeOptionIds", [
                                        ...currentOptions,
                                        opt.id,
                                      ]);
                                    }
                                  }}
                                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                                    isChecked
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-muted/50 border-border hover:bg-muted"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: PRICING PACKAGES MATRIX */}
              <TabsContent value="packages" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["basic", "standard", "premium"] as const).map(
                    (pType, pIdx) => (
                      <div
                        key={pType}
                        className="p-4 rounded-xl border border-border bg-card space-y-3"
                      >
                        <Badge
                          variant={pType === "standard" ? "default" : "outline"}
                          className="uppercase text-[10px] font-black"
                        >
                          {pType} Package
                        </Badge>

                        <div className="space-y-2">
                          <Input
                            placeholder="Judul Paket"
                            {...register(`packages.${pIdx}.title`)}
                            className="h-8 text-xs font-bold"
                          />
                          <Input
                            placeholder="Deskripsi singkat"
                            {...register(`packages.${pIdx}.description`)}
                            className="h-8 text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">$</span>
                            <Input
                              type="number"
                              placeholder="Harga ($)"
                              {...register(`packages.${pIdx}.price`, {
                                valueAsNumber: true,
                              })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground">
                                Hari Pengiriman
                              </label>
                              <Input
                                type="number"
                                {...register(
                                  `packages.${pIdx}.deliveryTimeDays`,
                                  { valueAsNumber: true },
                                )}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground">
                                Revisi
                              </label>
                              <Input
                                type="number"
                                {...register(`packages.${pIdx}.revisions`, {
                                  valueAsNumber: true,
                                })}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Package Feature Values Checklist */}
                        {catMeta?.packageFeatures &&
                          catMeta.packageFeatures.length > 0 && (
                            <div className="border-t border-border pt-3 space-y-2">
                              <span className="text-[11px] font-bold text-muted-foreground block">
                                Checklist Fitur Paket:
                              </span>
                              {catMeta.packageFeatures.map((feat, fIdx) => {
                                const currentFV = watch(
                                  `packages.${pIdx}.featureValues`,
                                );
                                const existIdx = currentFV?.findIndex(
                                  (fv) => fv.packageFeatureId === feat.id,
                                );
                                const isIncluded =
                                  existIdx !== undefined && existIdx !== -1
                                    ? currentFV[existIdx]?.isIncluded
                                    : false;

                                return (
                                  <div
                                    key={feat.id}
                                    className="flex items-center justify-between text-xs py-1"
                                  >
                                    <span className="truncate pr-2">
                                      {feat.name}
                                    </span>
                                    {feat.type === "boolean" ? (
                                      <input
                                        type="checkbox"
                                        checked={isIncluded ?? false}
                                        onChange={(e) => {
                                          const updatedFV = [
                                            ...(currentFV || []),
                                          ];
                                          const targetVal = e.target.checked;
                                          if (
                                            existIdx !== undefined &&
                                            existIdx !== -1
                                          ) {
                                            updatedFV[existIdx].isIncluded =
                                              targetVal;
                                          } else {
                                            updatedFV.push({
                                              packageFeatureId: feat.id,
                                              isIncluded: targetVal,
                                              value: null,
                                            });
                                          }
                                          setValue(
                                            `packages.${pIdx}.featureValues`,
                                            updatedFV,
                                          );
                                        }}
                                        className="h-4 w-4 rounded accent-primary cursor-pointer"
                                      />
                                    ) : (
                                      <Input
                                        placeholder={feat.type}
                                        value={
                                          existIdx !== undefined &&
                                          existIdx !== -1
                                            ? (currentFV[existIdx]?.value ?? "")
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const updatedFV = [
                                            ...(currentFV || []),
                                          ];
                                          const val = e.target.value;
                                          if (
                                            existIdx !== undefined &&
                                            existIdx !== -1
                                          ) {
                                            updatedFV[existIdx].value = val;
                                            updatedFV[existIdx].isIncluded =
                                              !!val;
                                          } else {
                                            updatedFV.push({
                                              packageFeatureId: feat.id,
                                              isIncluded: !!val,
                                              value: val,
                                            });
                                          }
                                          setValue(
                                            `packages.${pIdx}.featureValues`,
                                            updatedFV,
                                          );
                                        }}
                                        className="h-6 w-20 text-[10px] px-1.5"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    ),
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="font-bold min-w-[140px]"
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Simpan & Publikasikan"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
