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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";
import { MarkdownTextarea } from "@/components/ui/markdown-textarea";
import {
  Link2,
  Lock,
  Unlock,
  RefreshCw,
  UserCheck,
  Layers,
  FileText,
  ImageIcon,
  User,
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
  isLoadingSellers?: boolean;
  isLoadingCategories?: boolean;
}

export function GigOverviewTab({
  sellers,
  subcategories,
  isEdit,
  isPending,
  isSuperAdmin,
  currentUserId,
  isLoadingSellers,
  isLoadingCategories,
}: GigOverviewTabProps) {
  const form = useFormContext<GigFormValues>();
  const [autoSyncSlug, setAutoSyncSlug] = useState(!isEdit);

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
      {/* SECTION 1: Informasi Utama */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Informasi Layanan
          </span>
        </div>

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

      {/* SECTION 2: Kepemilikan & Kategori */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/40 space-y-3.5">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Kepemilikan & Kategori
            </span>
          </div>
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

              const selectedSeller = sellers?.find(
                (s) => s.id === activeSellerId,
              );
              const currentSellerName = selectedSeller?.name ?? "Akun Anda";

              return (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex items-center justify-between">
                    <span>Seller / Freelancer</span>
                  </FormLabel>

                  {isLoadingSellers ? (
                    <Skeleton className="h-10 sm:h-9 w-full rounded-xl" />
                  ) : !isSuperAdmin ? (
                    <div className="flex items-center justify-between h-10 sm:h-9 px-3 rounded-xl border border-border/80 bg-muted/40 text-xs text-foreground font-medium transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                          {currentSellerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate font-semibold">
                          {currentSellerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold text-primary px-1.5 py-0"
                        >
                          Akun Anda
                        </Badge>
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/70" />
                      </div>
                    </div>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={activeSellerId ?? undefined}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-9 text-xs">
                          <SelectValue placeholder="Pilih Seller">
                            {selectedSeller ? (
                              <div className="flex items-center gap-2 truncate">
                                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate">
                                  {selectedSeller.name}
                                </span>
                              </div>
                            ) : null}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="z-60 max-h-60 overflow-y-auto"
                      >
                        {sellers?.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={s.id}
                            className="text-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span>{s.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            render={({ field }) => {
              const selectedSubcategory = subcategories.find(
                (c) => c.id === field.value,
              );

              return (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Sub-Kategori
                  </FormLabel>

                  {isLoadingCategories ? (
                    <Skeleton className="h-10 sm:h-9 w-full rounded-xl" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-9 text-xs">
                          <SelectValue placeholder="Pilih Sub-Kategori">
                            {selectedSubcategory ? (
                              <div className="flex items-center gap-2 truncate">
                                <Layers className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                <span className="truncate">
                                  {selectedSubcategory.name}
                                </span>
                              </div>
                            ) : null}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        sideOffset={4}
                        alignItemWithTrigger={false}
                        className="z-60 max-h-60 overflow-y-auto"
                      >
                        {subcategories.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="text-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Layers className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                              <span>{c.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      {/* SECTION 3: Visual & Sampul */}
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

      {/* SECTION 4: Deskripsi Detail (Markdown Editor) */}
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
                <MarkdownTextarea
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Jelaskan detail keahlian, alur pengerjaan, dan keunggulan jasa ini menggunakan format Markdown..."
                  disabled={isPending}
                  minHeight="min-h-52"
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
