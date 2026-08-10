"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  // Query data pembantu (Sellers & Categories)
  const { data: sellers } = trpc.admin.getAllSellers.useQuery();
  const { data: categoryTree } = trpc.admin.getCategoryTree.useQuery();

  // Flatten subcategories untuk dropdown pilihan kategori
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
          ],
        },
  });

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
      description="Isi rincian informasi Gig/Layanan yang akan ditampilkan di platform."
      form={form}
      onSubmit={(data) => {
        mutation.mutate({
          ...data,
          slug: data.slug || slugify(data.title),
        });
      }}
      isPending={mutation.isPending}
      submitText={isEdit ? "Simpan Perubahan" : "Publikasikan Gig"}
      maxWidth="md"
    >
      <div className="space-y-3">
        {/* Form Input Judul */}
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
                  placeholder="Contoh: I will design a modern web application"
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

        {/* Grid Selection: Seller & Kategori */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="sellerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Seller
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value} // 👈 Diubah dari defaultValue ke value
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
                  value={field.value} // 👈 Diubah dari defaultValue ke value
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

        {/* Input Cover Image */}
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

        {/* Textarea Description */}
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
      </div>
    </BaseAdminDialog>
  );
}
