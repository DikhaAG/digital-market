// src/app/admin/gigs/_components/dialogs/upsert-gig-dialog.tsx
"use client";

import { useState, useEffect } from "react";
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
import { authClient } from "@/lib/auth-client";
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

  static createInitialValues(
    gigToEdit?: GigAuditItem,
    currentUserId?: string,
  ): GigFormValues {
    if (gigToEdit) {
      return {
        id: gigToEdit.id,
        sellerId: gigToEdit.seller?.id ?? currentUserId ?? "",
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
      sellerId: currentUserId ?? "",
      categoryId: "",
      about: "",
      coverImage: "",
      attributeOptionIds: [],
      packages: this.createPackages(),
    };
  }
}

export function UpsertGigDialog({ gigToEdit }: UpsertGigDialogProps) {
  const isEdit = Boolean(gigToEdit);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const { data: sessionData } = authClient.useSession();
  const currentUser = sessionData?.user;
  const isSuperAdmin =
    (currentUser as { role?: string } | undefined)?.role === "super_admin";

  const { trpc: trpcClient, createOptions } = useGigMutation();
  const { data: sellers, isLoading: isLoadingSellers } =
    trpc.admin.getAllSellers.useQuery(undefined, {
      enabled: open,
    });
  const { data: categoryTree, isLoading: isLoadingCategories } =
    trpc.admin.getCategoryTree.useQuery(undefined, { enabled: open });

  const subcategories =
    categoryTree?.flatMap((parent) => parent.subcategories) ?? [];

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: GigFormFactory.createInitialValues(
      gigToEdit,
      currentUser?.id,
    ),
  });

  useEffect(() => {
    if (open && currentUser?.id && !form.getValues("sellerId")) {
      form.setValue("sellerId", currentUser.id);
    }
  }, [open, currentUser?.id, form]);

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const attributeOptionIds =
    useWatch({ control: form.control, name: "attributeOptionIds" }) ?? [];

  const isCategoryValid = Boolean(
    selectedCategoryId && selectedCategoryId.trim().length > 0,
  );

  const { data: catMeta, isLoading: isLoadingMeta } =
    trpc.admin.getCategoryGigMeta.useQuery(
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
      form.reset(
        GigFormFactory.createInitialValues(gigToEdit, currentUser?.id),
      );
    }
  };

  const handleInvalidSubmit = (formErrors: FieldErrors<GigFormValues>) => {
    console.error("Form Validation Errors:", formErrors);
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
      sellerId: isSuperAdmin
        ? data.sellerId
        : (currentUser?.id ?? data.sellerId),
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
            className="h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground shrink-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="font-semibold gap-2 rounded-xl shadow-xs w-full sm:w-auto h-10 sm:h-9">
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
      maxWidth="lg"
    >
      <FormProvider {...form}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ActiveTab)}
          className="w-full space-y-3"
        >
          <TabsList className="bg-muted/70 grid grid-cols-3 h-auto p-1 gap-1 rounded-xl w-full">
            {/* Tab 1: Overview */}
            <TabsTrigger
              value="overview"
              title="1. Overview"
              aria-label="1. Overview"
              className="text-xs font-bold py-2.5 sm:py-2 data-[state=active]:bg-background flex items-center justify-center gap-1.5 relative rounded-lg transition-all"
            >
              <Info className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 text-primary" />
              <span className="hidden sm:inline truncate">1. Overview</span>
              {hasOverviewError && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </TabsTrigger>

            {/* Tab 2: Atribut */}
            <TabsTrigger
              value="attributes"
              disabled={!isCategoryValid}
              title={`2. Atribut (${attributeOptionIds.length})`}
              aria-label={`2. Atribut (${attributeOptionIds.length})`}
              className="text-xs font-bold py-2.5 sm:py-2 data-[state=active]:bg-background flex items-center justify-center gap-1.5 relative rounded-lg transition-all"
            >
              <SlidersHorizontal className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 text-primary" />
              <span className="hidden sm:inline truncate">
                2. Atribut ({attributeOptionIds.length})
              </span>
              {attributeOptionIds.length > 0 && (
                <span className="sm:hidden font-mono text-[9px] font-black bg-primary/15 text-primary px-1 rounded-md">
                  {attributeOptionIds.length}
                </span>
              )}
            </TabsTrigger>

            {/* Tab 3: Paket Harga */}
            <TabsTrigger
              value="packages"
              disabled={!isCategoryValid}
              title="3. Paket Harga"
              aria-label="3. Paket Harga"
              className="text-xs font-bold py-2.5 sm:py-2 data-[state=active]:bg-background flex items-center justify-center gap-1.5 relative rounded-lg transition-all"
            >
              <Package className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 text-primary" />
              <span className="hidden sm:inline truncate">3. Paket Harga</span>
              {hasPackagesError && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="mt-0 focus-visible:outline-none"
          >
            <GigOverviewTab
              sellers={sellers}
              subcategories={subcategories}
              isEdit={isEdit}
              isPending={mutation.isPending}
              isSuperAdmin={isSuperAdmin}
              currentUserId={currentUser?.id}
              isLoadingSellers={isLoadingSellers}
              isLoadingCategories={isLoadingCategories}
            />
          </TabsContent>
          <TabsContent
            value="attributes"
            className="mt-0 focus-visible:outline-none"
          >
            <GigAttributesTab
              attributes={catMeta?.attributes}
              isLoading={isLoadingMeta}
            />
          </TabsContent>

          <TabsContent
            value="packages"
            className="mt-0 focus-visible:outline-none"
          >
            <GigPackagesTab
              packageFeatures={catMeta?.packageFeatures}
              isLoadingMeta={isLoadingMeta}
            />
          </TabsContent>
        </Tabs>
      </FormProvider>
    </BaseAdminDialog>
  );
}
