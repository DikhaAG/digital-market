"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { FolderPlus, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  parentCategorySchema,
  subCategorySchema,
  slugify,
  type ParentCategoryInput,
  type SubCategoryInput,
} from "../_schemas/category-admin.schema";

export function CreateParentCategoryDialog() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentCategoryInput>({
    resolver: zodResolver(parentCategorySchema),
  });

  const mutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Kategori utama berhasil dibuat");
      utils.admin.getCategoryTree.invalidate();
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="font-semibold gap-2 rounded-xl shadow-xs">
            <FolderPlus className="h-4 w-4" />
            Tambah Kategori Utama
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Kategori Utama (Parent)</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            mutation.mutate({
              name: data.name,
              slug: slugify(data.name),
              icon: data.icon || null,
            }),
          )}
          className="space-y-4 pt-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              Nama Kategori
            </label>
            <Input
              placeholder="Contoh: Programming & Tech"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              Nama Icon Lucide (Opsional)
            </label>
            <Input
              placeholder="code, palette, terminal..."
              {...register("icon")}
            />
          </div>
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Simpan Kategori Utama
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateSubCategoryDialog({
  parentId,
  parentName,
}: {
  parentId: string;
  parentName: string;
}) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategorySchema),
  });

  const mutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Sub-kategori berhasil dibuat");
      utils.admin.getCategoryTree.invalidate();
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-xs font-semibold gap-1.5 rounded-lg"
          >
            <Plus className="h-3.5 w-3.5" />
            Sub-kategori
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Sub-kategori untuk {parentName}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            mutation.mutate({
              name: data.name,
              slug: slugify(data.name),
              parentId,
            }),
          )}
          className="space-y-4 pt-4"
        >
          <div className="space-y-1.5">
            <Input
              placeholder="Contoh: Web Development"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.name.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Simpan Sub-kategori
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
