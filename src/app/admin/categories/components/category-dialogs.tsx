"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { FolderPlus, Loader2, Plus, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  parentCategorySchema,
  subCategorySchema,
  slugify,
  type ParentCategoryInput,
  type SubCategoryInput,
} from "../_schemas/category-admin.schema";

/**
 * Dialog Komponen untuk Membuat Kategori Utama (Parent Category)
 */
export function CreateParentCategoryDialog() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const form = useForm<ParentCategoryInput>({
    resolver: zodResolver(parentCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  // UseWatch untuk kepatuhan React Compiler
  const watchedName = useWatch({ control: form.control, name: "name" });
  const liveSlug = watchedName ? slugify(watchedName) : "";

  const mutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Kategori utama berhasil dibuat");
      utils.admin.getCategoryTree.invalidate();
      handleOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Gagal membuat kategori utama");
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      mutation.reset();
    }
  };

  const onSubmit = (data: ParentCategoryInput) => {
    mutation.mutate({
      name: data.name,
      slug: slugify(data.name),
      icon: data.icon || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="font-semibold gap-2 rounded-xl shadow-xs transition-all hover:shadow-sm">
            <FolderPlus className="h-4 w-4" />
            <span>Tambah Kategori Utama</span>
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Buat Kategori Utama (Parent)
          </DialogTitle>
          <DialogDescription>
            Kategori utama akan menjadi pengelompokan tingkat atas untuk
            layanan/gig.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Nama Kategori
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Programming & Tech"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>

                  {liveSlug && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                      <Link2 className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">slug: {liveSlug}</span>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Nama Icon Lucide (Opsional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="code, palette, terminal..."
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Gunakan nama ikon yang valid dari pustaka Lucide React.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full font-bold gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Simpan Kategori Utama</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dialog Komponen untuk Membuat Sub-Kategori
 */
export function CreateSubCategoryDialog({
  parentId,
  parentName,
}: {
  parentId: string;
  parentName: string;
}) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const form = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const liveSlug = watchedName ? slugify(watchedName) : "";

  const mutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Sub-kategori berhasil dibuat");
      utils.admin.getCategoryTree.invalidate();
      handleOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Gagal membuat sub-kategori");
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      mutation.reset();
    }
  };

  const onSubmit = (data: SubCategoryInput) => {
    mutation.mutate({
      name: data.name,
      slug: slugify(data.name),
      parentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-xs font-semibold gap-1.5 rounded-lg border border-border/40 hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Sub-kategori</span>
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Tambah Sub-kategori
          </DialogTitle>
          <DialogDescription className="text-xs">
            Sub-kategori akan ditambahkan di bawah induk{" "}
            <span className="font-semibold text-foreground">{parentName}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                    Nama Sub-Kategori
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Web Development"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>

                  {liveSlug && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                      <Link2 className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">slug: {liveSlug}</span>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full font-bold gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  "Simpan Sub-kategori"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
