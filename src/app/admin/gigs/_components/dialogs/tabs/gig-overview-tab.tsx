// src/app/admin/gigs/_components/dialogs/tabs/gig-overview-tab.tsx
"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  Link2,
  Lock,
  Unlock,
  RefreshCw,
  UserCheck,
  Layers,
  FileText,
  ImageIcon,
} from "lucide-react";
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
  const [autoSyncSlug, setAutoSyncSlug] = useState(!isEdit);

  // Live Watcher untuk Character Counters
  const watchedTitle = useWatch({ control: form.control, name: "title" }) ?? "";
  const watchedAbout = useWatch({ control: form.control, name: "about" }) ?? "";
  const watchedSlug = useWatch({ control: form.control, name: "slug" }) ?? "";

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (val: string) => void,
  ) => {
    const value = e.target.value;
    fieldOnChange(value);

    if (autoSyncSlug) {
      form.setValue("slug", slugify(value), { shouldValidate: true });
    }
  };

  const handleManualSyncSlug = () => {
    form.setValue("slug", slugify(watchedTitle), { shouldValidate: true });
  };

  return (
    <div className="space-y-4 pt-3">
      {/* SECTION 1: Informasi Utama (Title & Slug) */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Informasi Layanan
          </span>
        </div>

        {/* Field: Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Judul Gig
                </FormLabel>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    watchedTitle.length > 80
                      ? "text-destructive"
                      : watchedTitle.length >= 5
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {watchedTitle.length} / 80
                </span>
              </div>
              <FormControl>
                <Input
                  placeholder="Contoh: I will build a modern fullstack web application"
                  disabled={isPending}
                  className="h-10 sm:h-9 text-xs transition-all focus-visible:ring-1"
                  {...field}
                  onChange={(e) => handleTitleChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Field: Slug dengan Live Domain Preview & Lock Toggle */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  URL Slug SEO
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground gap-1"
                  onClick={() => setAutoSyncSlug((prev) => !prev)}
                  title={
                    autoSyncSlug
                      ? "Nonaktifkan sinkronisasi otomatis dari judul"
                      : "Aktifkan sinkronisasi otomatis dari judul"
                  }
                >
                  {autoSyncSlug ? (
                    <>
                      <Lock className="h-3 w-3 text-emerald-500" />
                      <span>Auto Sync</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3 text-amber-500" />
                      <span>Manual Input</span>
                    </>
                  )}
                </Button>
              </div>
              <FormControl>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <Input
                      placeholder="modern-fullstack-web-application"
                      disabled={isPending || autoSyncSlug}
                      className="h-10 sm:h-9 text-xs font-mono disabled:opacity-80 disabled:bg-muted/40"
                      {...field}
                    />
                  </div>
                  {!autoSyncSlug && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9 shrink-0"
                      onClick={handleManualSyncSlug}
                      title="Generate dari Judul Saat Ini"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </FormControl>
              {watchedSlug && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
                  <Link2 className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">/gigs/{watchedSlug}</span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* SECTION 2: Relasi & Kepemilikan (Seller & Sub-Category) */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <UserCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Kepemilikan & Kategori
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Field: Seller */}
          <FormField
            control={form.control}
            name="sellerId"
            render={({ field }) => {
              const activeSellerId = !isSuperAdmin
                ? (currentUserId ?? field.value)
                : field.value;

              return (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex items-center justify-between">
                    <span>Seller / Freelancer</span>
                    {!isSuperAdmin && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold text-primary px-1.5 py-0"
                      >
                        Akun Anda
                      </Badge>
                    )}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={activeSellerId ?? undefined}
                    disabled={isPending || !isSuperAdmin}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-9 text-xs disabled:opacity-85 disabled:bg-muted/50">
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
                    <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                      Otomatis dikunci ke identitas akun toko Anda.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Field: Sub-Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3 text-muted-foreground" />
                  <span>Sub-Kategori</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 sm:h-9 text-xs">
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
      </div>

      {/* SECTION 3: Visual & Sampul (Cover Image Uploader) */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Sampul Visual
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Rasio 16:9 Recommended
          </span>
        </div>

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
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
      </div>

      {/* SECTION 4: Deskripsi Detail (About Textarea) */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3">
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Deskripsi Lengkap (About)
                </FormLabel>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    watchedAbout.length >= 10
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {watchedAbout.length} Karakter (Min. 10)
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan detail keahlian, alur pengerjaan, dan keunggulan jasa ini secara rinci..."
                  className="min-h-[120px] text-xs resize-y transition-all focus-visible:ring-1"
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
    </div>
  );
}
