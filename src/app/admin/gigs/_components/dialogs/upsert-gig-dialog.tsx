"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

  // Query Data Pembantu (Sellers & Categories)[cite: 23]
  const { data: sellers } = trpc.admin.getAllSellers.useQuery();
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery();

  const subcategories =
    categoryTree?.flatMap((parent) => parent.subcategories) ?? [];

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
          attributeOptionIds:
            gigToEdit.gigAttributes?.map((ga) => ga.attributeOptionId) ?? [],
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
              description: "",
              price: 15,
              deliveryTimeDays: 3,
              revisions: 2,
              featureValues: [],
            },
            {
              packageType: "standard",
              title: "Standard Package",
              description: "",
              price: 35,
              deliveryTimeDays: 2,
              revisions: 5,
              featureValues: [],
            },
            {
              packageType: "premium",
              title: "Premium Package",
              description: "",
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

  const isCategoryValid = Boolean(
    selectedCategoryId && selectedCategoryId.trim().length > 0,
  );

  // Query Metadata Atribut & Fitur Kategori Terpilih
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
      description="Lengkapi konfigurasi informasi, filter atribut kustom, dan paket harga."
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
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background"
          >
            1. Overview
          </TabsTrigger>
          <TabsTrigger
            value="attributes"
            disabled={!selectedCategoryId}
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background"
          >
            2. Atribut Filter
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            disabled={!selectedCategoryId}
            className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background"
          >
            3. Paket Harga
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
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
                        <SelectValue placeholder="Pilih Kategori" />
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

        {/* TAB 2: ATRIBUT FILTER DINAMIS */}
        <TabsContent value="attributes" className="space-y-3 pt-3">
          {!catMeta?.attributes || catMeta.attributes.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-xl bg-muted/20">
              <p className="text-xs text-muted-foreground italic">
                Tidak ada atribut filter kustom untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {catMeta.attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="p-3 rounded-xl border border-border bg-card/60 space-y-2"
                >
                  <span className="font-bold text-xs text-foreground block">
                    {attr.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {attr.options.map((opt) => {
                      const isChecked = attributeOptionIds.includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
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
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 ${
                            isChecked
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/50 border-border hover:bg-muted"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
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

        {/* TAB 3: PAKET HARGA & CHECKLIST FITUR */}
        <TabsContent value="packages" className="space-y-3 pt-3">
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {(["basic", "standard", "premium"] as const).map((pType, pIdx) => (
              <div
                key={pType}
                className="p-3.5 rounded-xl border border-border bg-card space-y-3"
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

                {/* Checklist Fitur Kategori */}
                {catMeta?.packageFeatures &&
                  catMeta.packageFeatures.length > 0 && (
                    <div className="border-t border-border/50 pt-2.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground block">
                        Fitur Paket:
                      </span>
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

                        return (
                          <div
                            key={feat.id}
                            className="flex items-center justify-between text-xs py-0.5"
                          >
                            <span className="truncate text-muted-foreground">
                              {feat.name}
                            </span>
                            <input
                              type="checkbox"
                              checked={isIncluded ?? false}
                              onChange={(e) => {
                                const updatedFV = [...currentFV];
                                const targetVal = e.target.checked;
                                if (existIdx !== -1) {
                                  updatedFV[existIdx] = {
                                    ...updatedFV[existIdx],
                                    isIncluded: targetVal,
                                  };
                                } else {
                                  updatedFV.push({
                                    packageFeatureId: feat.id,
                                    isIncluded: targetVal,
                                    value: null,
                                  });
                                }
                                form.setValue(
                                  `packages.${pIdx}.featureValues`,
                                  updatedFV,
                                );
                              }}
                              className="h-4 w-4 rounded accent-primary cursor-pointer"
                            />
                          </div>
                        );
                      })}
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
