// src/app/admin/gigs/_components/dialogs/upsert-gig-dialog.tsx
"use client";

import { useState } from "react";
import {
  useForm,
  useWatch,
  FormProvider,
  type FieldErrors,
} from "react-hook-form";
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
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

import { useGigMutation } from "../../_hooks/use-gig-mutation";
import {
  gigFormSchema,
  slugify,
  type GigFormValues,
  type GigAuditItem,
} from "../../_schemas/gig-admin-schema";

import { GigOverviewTab } from "./tabs/gig-overview-tab";
import { GigAttributesTab } from "./tabs/gig-attributes-tab";
import { GigPackagesTab } from "./tabs/gig-packages-tab";

// -----------------------------------------------------------------------------
// Domain Types & Constants
// -----------------------------------------------------------------------------

type ActiveTab = "overview" | "attributes" | "packages";

interface UpsertGigDialogProps {
  gigToEdit?: GigAuditItem;
}

const PACKAGE_TYPES = ["basic", "standard", "premium"] as const;

const DEFAULT_PACKAGE_CONFIGS: Record<
  (typeof PACKAGE_TYPES)[number],
  { price: number; deliveryTimeDays: number; revisions: number }
> = {
  basic: { price: 15, deliveryTimeDays: 3, revisions: 2 },
  standard: { price: 35, deliveryTimeDays: 2, revisions: 5 },
  premium: { price: 75, deliveryTimeDays: 1, revisions: 99 },
};

// -----------------------------------------------------------------------------
// Factory Pattern: Form Initializer & Normalizer
// -----------------------------------------------------------------------------

class GigFormFactory {
  static createPackages(
    existingPackages?: GigAuditItem["packages"],
  ): GigFormValues["packages"] {
    return PACKAGE_TYPES.map((pType) => {
      const found = existingPackages?.find(
        (pkg) => pkg.packageType?.toLowerCase() === pType,
      );

      if (found) {
        return {
          packageType: pType,
          title: found.title ?? "",
          description: found.description ?? "",
          price: found.price ?? 0,
          deliveryTimeDays: found.deliveryTimeDays ?? 1,
          revisions: found.revisions ?? 0,
          featureValues:
            found.featureValues?.map((fv) => ({
              packageFeatureId: fv.packageFeatureId,
              isIncluded: fv.isIncluded ?? false,
              value: fv.value ?? "",
            })) ?? [],
        };
      }

      const config = DEFAULT_PACKAGE_CONFIGS[pType];
      const formattedTitle = `${pType.charAt(0).toUpperCase() + pType.slice(1)} Package`;

      return {
        packageType: pType,
        title: formattedTitle,
        description: "",
        price: config.price,
        deliveryTimeDays: config.deliveryTimeDays,
        revisions: config.revisions,
        featureValues: [],
      };
    });
  }

  static createInitialValues(gigToEdit?: GigAuditItem): GigFormValues {
    if (gigToEdit) {
      return {
        id: gigToEdit.id,
        sellerId: gigToEdit.seller?.id ?? "",
        categoryId: gigToEdit.category?.id ?? "",
        title: gigToEdit.title,
        slug: gigToEdit.slug,
        about: gigToEdit.about ?? "",
        coverImage: gigToEdit.coverImage ?? "",
        attributeOptionIds:
          gigToEdit.gigAttributes?.map((ga) => ga.attributeOptionId) ?? [],
        packages: this.createPackages(gigToEdit.packages),
      };
    }

    return {
      title: "",
      slug: "",
      sellerId: "",
      categoryId: "",
      about: "",
      coverImage: "",
      attributeOptionIds: [],
      packages: this.createPackages(),
    };
  }
}

// -----------------------------------------------------------------------------
// Presentation Component
// -----------------------------------------------------------------------------

export function UpsertGigDialog({ gigToEdit }: UpsertGigDialogProps) {
  const isEdit = Boolean(gigToEdit);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const { trpc: trpcClient, createOptions } = useGigMutation();

  const { data: sellers } = trpc.admin.getAllSellers.useQuery(undefined, {
    enabled: open,
  });
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery(
    undefined,
    { enabled: open },
  );

  const subcategories =
    categoryTree?.flatMap((parent) => parent.subcategories) ?? [];

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: GigFormFactory.createInitialValues(gigToEdit),
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

  const errors = form.formState.errors;
  const hasOverviewError = Boolean(
    errors.title ||
    errors.sellerId ||
    errors.categoryId ||
    errors.slug ||
    errors.about ||
    errors.coverImage,
  );
  const hasPackagesError = Boolean(errors.packages);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setActiveTab("overview");
      form.reset(GigFormFactory.createInitialValues(gigToEdit));
    }
  };

  const handleInvalidSubmit = (formErrors: FieldErrors<GigFormValues>) => {
    console.error("❌ Form Validation Errors:", formErrors);
    toast.error(
      "Gagal menyimpan. Harap periksa bidang formulir yang belum lengkap.",
    );

    if (hasOverviewError) {
      setActiveTab("overview");
    } else if (hasPackagesError) {
      setActiveTab("packages");
    }
  };

  const handleSubmit = (data: GigFormValues) => {
    mutation.mutate({
      ...data,
      slug: data.slug || slugify(data.title),
    });
  };

  return (
    <BaseAdminDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        gigToEdit ? (
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
      title={gigToEdit ? `Edit Gig: ${gigToEdit.title}` : "Buat Gig Baru"}
      description="Lengkapi konfigurasi informasi umum, filter atribut kustom, dan matriks fitur paket harga."
      form={form}
      onSubmit={handleSubmit}
      onInvalidSubmit={handleInvalidSubmit}
      isPending={mutation.isPending}
      submitText={isEdit ? "Simpan Perubahan" : "Publikasikan Gig"}
      submitIcon={<Sparkles className="h-4 w-4" />}
      maxWidth="md"
    >
      <FormProvider {...form}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ActiveTab)}
          className="w-full"
        >
          <TabsList className="bg-muted/70 grid grid-cols-3 h-auto p-1 gap-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background flex items-center justify-center gap-1.5 relative"
            >
              <Info className="h-3.5 w-3.5" />
              <span>1. Overview</span>
              {hasOverviewError && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
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
              className="text-xs font-bold py-1.5 h-8 data-[state=active]:bg-background flex items-center justify-center gap-1.5 relative"
            >
              <Package className="h-3.5 w-3.5" />
              <span>3. Paket Harga</span>
              {hasPackagesError && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <GigOverviewTab
              sellers={sellers}
              subcategories={subcategories}
              isEdit={isEdit}
              isPending={mutation.isPending}
            />
          </TabsContent>

          <TabsContent value="attributes">
            <GigAttributesTab attributes={catMeta?.attributes} />
          </TabsContent>

          <TabsContent value="packages">
            <GigPackagesTab packageFeatures={catMeta?.packageFeatures} />
          </TabsContent>
        </Tabs>
      </FormProvider>
    </BaseAdminDialog>
  );
}
