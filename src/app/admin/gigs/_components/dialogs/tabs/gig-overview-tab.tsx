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
}

export function GigOverviewTab({
  sellers,
  subcategories,
  isEdit,
  isPending,
}: GigOverviewTabProps) {
  // 💡 Mengambil instance form dari FormProvider
  const form = useFormContext<GigFormValues>();

  return (
    <div className="space-y-3 pt-3">
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

      {/* Field Group: Seller & Sub-category */}
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
                disabled={isPending}
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

      {/* Field Group: Slug & Cover Image */}
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
                  disabled={isPending}
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
                className="min-h-20 text-xs resize-none"
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
