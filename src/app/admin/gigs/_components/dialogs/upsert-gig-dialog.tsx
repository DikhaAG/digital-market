"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Sparkles,
  SlidersHorizontal,
  Package,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseAdminDialog } from "@/app/admin/categories/components/base-admin-dialog";
import { useGigMutation } from "../../_hooks/use-gig-mutation";
import {
  gigFormSchema,
  slugify,
  type GigFormValues,
  type GigAuditItem,
} from "../../_schemas/gig-admin-schema";
import { trpc } from "@/lib/trpc/client";

// Import Sub-komponen Tab
import { GigOverviewTab } from "./tabs/gig-overview-tab";
import { GigAttributesTab } from "./tabs/gig-attributes-tab";
import { GigPackagesTab } from "./tabs/gig-packages-tab";

interface UpsertGigDialogProps {
  gigToEdit?: GigAuditItem;
}

export function UpsertGigDialog({ gigToEdit }: UpsertGigDialogProps) {
  const isEdit = !!gigToEdit;
  const [open, setOpen] = useState(false);
  const { trpc: trpcClient, createOptions } = useGigMutation();

  // 1. Fetching Master Data (Hanya saat dialog TERBUKA)
  const { data: sellers } = trpc.admin.getAllSellers.useQuery(undefined, {
    enabled: open,
  });
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery(
    undefined,
    {
      enabled: open,
    },
  );

  const subcategories =
    categoryTree?.flatMap((parent) => parent.subcategories) ?? [];

  // 2. Initial Form Setup
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

  const isCategoryValid = Boolean(
    selectedCategoryId && selectedCategoryId.trim().length > 0,
  );

  // 3. Fetch Metadata Entitas
  const { data: catMeta } = trpc.admin.getCategoryGigMeta.useQuery(
    { categoryId: selectedCategoryId! },
    { enabled: open && isCategoryValid },
  );

  const mutation = trpcClient.admin.upsertGig.useMutation(
    createOptions({
      loadingMessage: isEdit ? "Memperbarui Gig..." : "Membuat Gig baru...",
      successMessage: isEdit
        ? "Gig berhasil diperbarui"
        : "Gig berhasil dipublikasikan",
      onSuccess: () => setOpen(false),
    }),
  );

  return (
    <BaseAdminDialog
      open={open}
      onOpenChange={setOpen}
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

        <TabsContent value="overview">
          <GigOverviewTab
            form={form}
            sellers={sellers}
            subcategories={subcategories}
            isEdit={isEdit}
            isPending={mutation.isPending}
          />
        </TabsContent>

        <TabsContent value="attributes">
          <GigAttributesTab form={form} attributes={catMeta?.attributes} />
        </TabsContent>

        <TabsContent value="packages">
          <GigPackagesTab
            form={form}
            packageFeatures={catMeta?.packageFeatures}
          />
        </TabsContent>
      </Tabs>
    </BaseAdminDialog>
  );
}
