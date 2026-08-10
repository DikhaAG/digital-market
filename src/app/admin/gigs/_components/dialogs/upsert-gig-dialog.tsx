"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Check,
  Sparkles,
  SlidersHorizontal,
  Package,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseAdminDialog } from "@/app/admin/categories/components/base-admin-dialog";
import { useGigMutation } from "../../_hooks/use-gig-mutation";
import {
  gigFormSchema,
  slugify,
  type GigFormValues,
  type GigAuditItem,
} from "../../_schemas/gig-admin-schema";
import { trpc } from "@/lib/trpc/client";

interface UpsertGigDialogProps {
  gigToEdit?: GigAuditItem;
}

export function UpsertGigDialog({ gigToEdit }: UpsertGigDialogProps) {
  const isEdit = !!gigToEdit;
  const { trpc: trpcClient, createOptions } = useGigMutation();

  // 1. Fetching Master Data (Sellers & Categories Tree)
  const { data: sellers } = trpc.admin.getAllSellers.useQuery();
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery();

  const subcategories =
    categoryTree?.flatMap((parent) => parent.subcategories) ?? [];

  // 2. React Hook Form Initialization
  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: gigToEdit
      ? {
          id: gigToEdit.id,
          sellerId: gigToEdit.seller?.id ?? "",
          categoryId: gigToEdit.category?.id ?? "",
          title: gigToEdit.title,
          slug: gigToEdit.slug,
          about: gigToEdit.about ?? "",
          coverImage: gigToEdit.coverImage ?? "",
          // [gigAttributeOptions] Mapping array of Option IDs
          attributeOptionIds:
            gigToEdit.gigAttributes?.map((ga) => ga.attributeOptionId) ?? [],
          // [gigPackages & gigPackageFeatureValues] Mapping 3 Tier Packages
          packages:
            gigToEdit.packages.length > 0
              ? gigToEdit.packages.map((pkg) => ({
                  packageType: pkg.packageType,
                  title: pkg.title ?? "",
                  description: pkg.description ?? "",
                  price: pkg.price,
                  deliveryTimeDays: pkg.deliveryTimeDays ?? 1,
                  revisions: pkg.revisions ?? 0,
                  featureValues:
                    pkg.featureValues?.map((fv) => ({
                      packageFeatureId: fv.packageFeatureId,
                      isIncluded: fv.isIncluded ?? false,
                      value: fv.value ?? null,
                    })) ?? [],
                }))
              : [
                  {
                    packageType: "basic",
                    title: "Basic Service",
                    description: "",
                    price: 10,
                    deliveryTimeDays: 2,
                    revisions: 1,
                    featureValues: [],
                  },
                ],
        }
      : {
          title: "",
          slug: "",
          sellerId: "",
          categoryId: "",
          about: "",
          coverImage: "",
          attributeOptionIds: [],
          packages: [
            {
              packageType: "basic",
              title: "Basic Package",
              description: "Paket dasar pencakupan standar",
              price: 15,
              deliveryTimeDays: 3,
              revisions: 2,
              featureValues: [],
            },
            {
              packageType: "standard",
              title: "Standard Package",
              description: "Paket menengah paling populer",
              price: 35,
              deliveryTimeDays: 2,
              revisions: 5,
              featureValues: [],
            },
            {
              packageType: "premium",
              title: "Premium Package",
              description: "Paket komprehensif skala penuh",
              price: 75,
              deliveryTimeDays: 1,
              revisions: 99,
              featureValues: [],
            },
          ],
        },
  });

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });
  const attributeOptionIds =
    useWatch({ control: form.control, name: "attributeOptionIds" }) ?? [];
  const packagesWatch =
    useWatch({ control: form.control, name: "packages" }) ?? [];

  // Validasi ID Kategori untuk mencegah error tRPC & bad request
  const isCategoryValid = Boolean(
    selectedCategoryId && selectedCategoryId.trim().length > 0,
  );

  // 3. Fetch Metadata Entitas [attributes, attributeOptions, packageFeatures]
  const { data: catMeta } = trpc.admin.getCategoryGigMeta.useQuery(
    { categoryId: selectedCategoryId! },
    { enabled: isCategoryValid },
  );

  const mutation = trpcClient.admin.upsertGig.useMutation(
    createOptions({
      loadingMessage: isEdit ? "Memperbarui Gig..." : "Membuat Gig baru...",
      successMessage: isEdit
        ? "Gig berhasil diperbarui"
        : "Gig berhasil dipublikasikan",
    }),
  );

  return (
    <BaseAdminDialog
      trigger={
        isEdit ? (
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Edit ${gigToEdit.title}`}
            title={`Edit ${gigToEdit.title}`}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="font-semibold gap-2 rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Tambah Gig Baru</span>
          </Button>
        )
      }
      title={isEdit ? `Edit Gig: ${gigToEdit.title}` : "Buat Gig Baru"}
      description="Lengkapi konfigurasi informasi umum, filter atribut kustom, dan matriks fitur paket harga."
      form={form}
      onSubmit={(data) => {
        mutation.mutate({
          ...data,
          slug: data.slug || slugify(data.title),
        });
      }}
      isPending={mutation.isPending}
      submitText={isEdit ? "Simpan Perubahan" : "Publikasikan Gig"}
      submitIcon={<Sparkles className="h-4 w-4" />}
      maxWidth="md"
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/70 grid grid-cols-3 h-auto p-1 gap-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background flex items-center justify-center gap-1.5"
          >
            <Info className="h-3.5 w-3.5" />
            <span>1. Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="attributes"
            disabled={!isCategoryValid}
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>2. Atribut ({attributeOptionIds.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            disabled={!isCategoryValid}
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background flex items-center justify-center gap-1.5"
          >
            <Package className="h-3.5 w-3.5" />
            <span>3. Paket Harga</span>
          </TabsTrigger>
        </TabsList>

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW & ENTITAS [categories]                              */}
        {/* ==================================================================== */}
        <TabsContent value="overview" className="space-y-3 pt-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Judul Gig
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: I will build a modern fullstack web application"
                    disabled={mutation.isPending}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!isEdit) {
                        form.setValue("slug", slugify(e.target.value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Seller / Freelancer
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Pilih Seller" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sellers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* [categories] Field Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Sub-Kategori
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Pilih Sub-Kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    URL Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="modern-fullstack-app"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    URL Cover Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://cdn.example.com/cover.jpg"
                      disabled={mutation.isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Deskripsi Gig (About)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan detail keahlian dan keunggulan jasa ini..."
                    className="min-h-20 text-xs resize-none"
                    disabled={mutation.isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 2: ENTITAS [attributes, attributeOptions, gigAttributeOptions]  */}
        {/* ==================================================================== */}
        <TabsContent value="attributes" className="space-y-3 pt-3">
          {!catMeta?.attributes || catMeta.attributes.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground italic">
                Tidak ada atribut filter kustom untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {/* Iterasi Atribut Master [attributes] */}
              {catMeta.attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="p-3 rounded-xl border border-border/80 bg-card/60 space-y-2"
                >
                  <span className="font-bold text-xs text-foreground block">
                    {attr.name}
                  </span>
                  {/* Iterasi Opsi Atribut Master [attributeOptions] */}
                  <div className="flex flex-wrap gap-1.5">
                    {attr.options.map((opt) => {
                      const isChecked = attributeOptionIds.includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          // Synchronize ke Junction Table [gigAttributeOptions]
                          onClick={() => {
                            if (isChecked) {
                              form.setValue(
                                "attributeOptionIds",
                                attributeOptionIds.filter(
                                  (id) => id !== opt.id,
                                ),
                              );
                            } else {
                              form.setValue("attributeOptionIds", [
                                ...attributeOptionIds,
                                opt.id,
                              ]);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 cursor-pointer ${
                            isChecked
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/50 border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 shrink-0" />}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 3: ENTITAS [packageFeatures, gigPackages, gigPackageFeatureValues] */}
        {/* ==================================================================== */}
        <TabsContent value="packages" className="space-y-3 pt-3">
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {/* Iterasi Paket [gigPackages] */}
            {(["basic", "standard", "premium"] as const).map((pType, pIdx) => (
              <div
                key={pType}
                className="p-3.5 rounded-xl border border-border bg-card space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={pType === "basic" ? "default" : "outline"}
                    className="uppercase text-[10px] font-extrabold px-2 py-0.5"
                  >
                    {pType} Package
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`packages.${pIdx}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                          Judul Paket
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Judul Paket"
                            className="h-8 text-xs"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${pIdx}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                          Harga ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Harga ($)"
                            className="h-8 text-xs"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`packages.${pIdx}.deliveryTimeDays`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                          Waktu Pengerjaan (Hari)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 1)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${pIdx}.revisions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                          Jumlah Revisi
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Checklist & Value Dinamis [packageFeatures & gigPackageFeatureValues] */}
                {catMeta?.packageFeatures &&
                  catMeta.packageFeatures.length > 0 && (
                    <div className="border-t border-border/60 pt-3 space-y-2">
                      <span className="text-[11px] font-extrabold text-foreground block">
                        Fitur Matriks [packageFeatures]:
                      </span>

                      <div className="space-y-2">
                        {catMeta.packageFeatures.map((feat) => {
                          const currentFV =
                            packagesWatch[pIdx]?.featureValues ?? [];
                          const existIdx = currentFV.findIndex(
                            (fv) => fv.packageFeatureId === feat.id,
                          );
                          const isIncluded =
                            existIdx !== -1
                              ? currentFV[existIdx]?.isIncluded
                              : false;
                          const customValue =
                            existIdx !== -1
                              ? (currentFV[existIdx]?.value ?? "")
                              : "";

                          const handleToggleChange = (checked: boolean) => {
                            const updatedFV = [...currentFV];
                            if (existIdx !== -1) {
                              updatedFV[existIdx] = {
                                ...updatedFV[existIdx],
                                isIncluded: checked,
                              };
                            } else {
                              updatedFV.push({
                                packageFeatureId: feat.id,
                                isIncluded: checked,
                                value: null,
                              });
                            }
                            form.setValue(
                              `packages.${pIdx}.featureValues`,
                              updatedFV,
                            );
                          };

                          const handleValueChange = (val: string) => {
                            const updatedFV = [...currentFV];
                            if (existIdx !== -1) {
                              updatedFV[existIdx] = {
                                ...updatedFV[existIdx],
                                value: val,
                              };
                            } else {
                              updatedFV.push({
                                packageFeatureId: feat.id,
                                isIncluded: true,
                                value: val,
                              });
                            }
                            form.setValue(
                              `packages.${pIdx}.featureValues`,
                              updatedFV,
                            );
                          };

                          return (
                            <div
                              key={feat.id}
                              className="p-2 rounded-lg border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-medium text-foreground truncate block">
                                  {feat.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase font-mono">
                                  Tipe: {feat.type}
                                </span>
                              </div>

                              {/* Input Dinamis berdasarkan Enum Type (boolean | text | number) */}
                              <div className="flex items-center gap-2 shrink-0">
                                {(feat.type === "text" ||
                                  feat.type === "number") && (
                                  <Input
                                    type={
                                      feat.type === "number" ? "number" : "text"
                                    }
                                    placeholder={
                                      feat.type === "number" ? "Jml" : "Nilai"
                                    }
                                    value={customValue}
                                    disabled={!isIncluded}
                                    onChange={(e) =>
                                      handleValueChange(e.target.value)
                                    }
                                    className="h-7 w-20 text-[11px]"
                                  />
                                )}

                                <Switch
                                  checked={isIncluded ?? false}
                                  onCheckedChange={handleToggleChange}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </BaseAdminDialog>
  );
}
