// src/app/admin/gigs/_components/dialogs/tabs/gig-overview-tab.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  slugify,
  type GigFormValues,
  type SellerItem,
} from "../../../_schemas/gig-admin-schema";

interface GigOverviewTabProps {
  sellers?: SellerItem[];
  subcategories: Array<{ id: string; name: string }>;
  isEdit: boolean;
  isPending: boolean;
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export function GigOverviewTab({
  sellers,
  subcategories,
  isEdit,
  isPending,
  isSuperAdmin,
  currentUserId,
}: GigOverviewTabProps) {
  const form = useFormContext<GigFormValues>();

  return (
    <div className="space-y-4 pt-3">
      {/* Field: Title */}
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
                disabled={isPending}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const isSlugDirty = form.getFieldState("slug").isDirty;
                  if (!isEdit && !isSlugDirty) {
                    form.setValue("slug", slugify(e.target.value), {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Field: Slug */}
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
                placeholder="modern-fullstack-web-application"
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Field Group: Seller & Sub-category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="sellerId"
          render={({ field }) => {
            // Nilai aktif seller: Jika bukan Super Admin, paksa selalu menggunakan currentUserId
            const activeSellerId = !isSuperAdmin
              ? (currentUserId ?? field.value)
              : field.value;

            return (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex items-center justify-between">
                  <span>Seller / Freelancer</span>
                  {!isSuperAdmin && (
                    <span className="text-[10px] text-primary font-semibold lowercase">
                      (Akun Anda)
                    </span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={activeSellerId ?? undefined}
                  disabled={isPending || !isSuperAdmin}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs disabled:opacity-80 disabled:bg-muted/50">
                      <SelectValue placeholder="Pilih Seller" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isSuperAdmin ? (
                      sellers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      // Jika Admin (Seller) biasa, hanya tampilkan opsi dirinya sendiri
                      <SelectItem
                        value={currentUserId ?? field.value ?? "self"}
                      >
                        {sellers?.find((s) => s.id === currentUserId)?.name ??
                          "Akun Anda"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!isSuperAdmin && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Otomatis ditetapkan ke toko milik Anda.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
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
                value={field.value ?? undefined}
                disabled={isPending}
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

      {/* Field: Cover Image */}
      <FormField
        control={form.control}
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Sampul Gambar Gig
            </FormLabel>
            <FormControl>
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                folder="marketplace/gigs"
                disabled={isPending}
                aspectRatio="video"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Field: About */}
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
                className="min-h-24 text-xs resize-none"
                disabled={isPending}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
