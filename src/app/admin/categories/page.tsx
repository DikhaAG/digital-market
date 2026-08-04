"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import {
  FolderPlus,
  Folder,
  Layers,
  Plus,
  CheckSquare,
  Filter,
  Trash2,
  Loader2,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ==========================================
// 1. ZOD SCHEMAS & UTILS
// ==========================================
const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parentCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  icon: z.string().optional(),
});

const subCategorySchema = z.object({
  name: z.string().min(2, "Nama sub-kategori minimal 2 karakter"),
});

const packageFeatureSchema = z.object({
  name: z.string().min(2, "Nama fitur minimal 2 karakter"),
  type: z.enum(["boolean", "text", "number"]),
});

const attributeSchema = z.object({
  name: z.string().min(2, "Nama atribut minimal 2 karakter"),
});

const attributeOptionSchema = z.object({
  label: z.string().min(1, "Label tidak boleh kosong"),
});

type ParentCategoryInput = z.infer<typeof parentCategorySchema>;
type SubCategoryInput = z.infer<typeof subCategorySchema>;
type PackageFeatureInput = z.infer<typeof packageFeatureSchema>;
type AttributeInput = z.infer<typeof attributeSchema>;
type AttributeOptionInput = z.infer<typeof attributeOptionSchema>;

// ==========================================
// 2. MODULAR FORM COMPONENTS (ISOLATED RHF)
// ==========================================

/** Form Dialog: Tambah Kategori Utama (Parent) */
function CreateParentCategoryDialog() {
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
      utils.admin.getCategoryTree.invalidate();
      reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: ParentCategoryInput) => {
    mutation.mutate({
      name: data.name,
      slug: slugify(data.name),
      icon: data.icon || null,
    });
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

/** Form Dialog: Tambah Sub-Kategori */
function CreateSubCategoryDialog({
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
      utils.admin.getCategoryTree.invalidate();
      reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: SubCategoryInput) => {
    mutation.mutate({
      name: data.name,
      slug: slugify(data.name),
      parentId,
    });
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

/** Inline Form: Tambah Package Feature */
function AddPackageFeatureForm({ categoryId }: { categoryId: string }) {
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFeatureInput>({
    resolver: zodResolver(packageFeatureSchema),
    defaultValues: { type: "boolean" },
  });

  const mutation = trpc.admin.addPackageFeature.useMutation({
    onSuccess: () => {
      utils.admin.getCategoryTree.invalidate();
      reset();
    },
  });

  const onSubmit = (data: PackageFeatureInput) => {
    mutation.mutate({
      categoryId,
      name: data.name,
      type: data.type,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Nama fitur (Contoh: Vector file, Revisions)"
          {...register("name")}
          className="h-8 text-xs max-w-xs"
        />
        <select
          {...register("type")}
          className="h-8 px-2 rounded-md border border-input bg-background text-xs"
        >
          <option value="boolean">Boolean (✓ / ✗)</option>
          <option value="number">Number (Angka)</option>
          <option value="text">Text (Kustom)</option>
        </select>
        <Button
          type="submit"
          size="sm"
          className="h-8 text-xs font-semibold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Fitur
            </>
          )}
        </Button>
      </div>
      {errors.name && (
        <p className="text-[11px] text-destructive font-medium">
          {errors.name.message}
        </p>
      )}
    </form>
  );
}

/** Inline Form: Tambah Filter Attribute */
function AddAttributeForm({ categoryId }: { categoryId: string }) {
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttributeInput>({
    resolver: zodResolver(attributeSchema),
  });

  const mutation = trpc.admin.createAttribute.useMutation({
    onSuccess: () => {
      utils.admin.getCategoryTree.invalidate();
      reset();
    },
  });

  const onSubmit = (data: AttributeInput) => {
    mutation.mutate({
      categoryId,
      name: data.name,
      slug: slugify(data.name),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nama Atribut (Contoh: Programming Language)"
          {...register("name")}
          className="h-8 text-xs max-w-xs"
        />
        <Button
          type="submit"
          size="sm"
          className="h-8 text-xs font-semibold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Atribut
            </>
          )}
        </Button>
      </div>
      {errors.name && (
        <p className="text-[11px] text-destructive font-medium">
          {errors.name.message}
        </p>
      )}
    </form>
  );
}

/** Inline Form: Tambah Attribute Option */
function AddAttributeOptionForm({ attributeId }: { attributeId: string }) {
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset } = useForm<AttributeOptionInput>({
    resolver: zodResolver(attributeOptionSchema),
  });

  const mutation = trpc.admin.createAttributeOption.useMutation({
    onSuccess: () => {
      utils.admin.getCategoryTree.invalidate();
      reset();
    },
  });

  const onSubmit = (data: AttributeOptionInput) => {
    mutation.mutate({
      attributeId,
      label: data.label,
      value: slugify(data.label),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-1.5 pt-1"
    >
      <Input
        placeholder="+ Opsi (misal: Python)"
        {...register("label")}
        className="h-7 text-[11px] px-2"
      />
      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="h-7 text-[11px] px-2 shrink-0 font-semibold"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          "Tambah"
        )}
      </Button>
    </form>
  );
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function CategoryAdminPage() {
  const utils = trpc.useUtils();
  const { data: categoryTree, isLoading } =
    trpc.admin.getCategoryTree.useQuery();

  // Mutations untuk Delete
  const deleteCategoryMutation = trpc.admin.deleteCategory.useMutation({
    onSuccess: () => utils.admin.getCategoryTree.invalidate(),
  });

  const deleteAttributeMutation = trpc.admin.deleteAttribute.useMutation({
    onSuccess: () => utils.admin.getCategoryTree.invalidate(),
  });

  const deleteOptionMutation = trpc.admin.deleteAttributeOption.useMutation({
    onSuccess: () => utils.admin.getCategoryTree.invalidate(),
  });

  const deleteFeatureMutation = trpc.admin.deletePackageFeature.useMutation({
    onSuccess: () => utils.admin.getCategoryTree.invalidate(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Section & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Categories & Relational Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola hirarki kategori, filter kustom atribut, serta checklist
            fitur paket komparasi.
          </p>
        </div>

        {/* Modular Dialog Kategori Utama */}
        <CreateParentCategoryDialog />
      </div>

      {/* Accordion / List Tree View */}
      <div className="space-y-6">
        {categoryTree?.map((parent) => (
          <div
            key={parent.id}
            className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs"
          >
            {/* Parent Category Header Bar */}
            <div className="p-4 sm:p-5 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-foreground text-base sm:text-lg">
                      {parent.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {parent.slug}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {parent.subcategories.length} Sub-kategori
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Modular Dialog Sub-Kategori */}
                <CreateSubCategoryDialog
                  parentId={parent.id}
                  parentName={parent.name}
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    deleteCategoryMutation.mutate({ id: parent.id })
                  }
                  disabled={deleteCategoryMutation.isPending}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sub-categories List & Deep Relations Management */}
            <div className="p-4 sm:p-6 space-y-6">
              {parent.subcategories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  Belum ada sub-kategori di bawah {parent.name}.
                </p>
              ) : (
                parent.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 sm:p-5 rounded-xl border border-border/80 bg-background space-y-4"
                  >
                    {/* Sub-category Title Bar */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        <span className="font-extrabold text-sm sm:text-base text-foreground">
                          {sub.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({sub.slug})
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {sub.gigs.length} Gigs
                        </Badge>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          deleteCategoryMutation.mutate({ id: sub.id })
                        }
                        disabled={deleteCategoryMutation.isPending}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Relational Tabs */}
                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="bg-muted/60 h-9 p-1">
                        <TabsTrigger
                          value="features"
                          className="text-xs font-semibold gap-1.5"
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                          Package Features ({sub.packageFeatures.length})
                        </TabsTrigger>
                        <TabsTrigger
                          value="attributes"
                          className="text-xs font-semibold gap-1.5"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          Filter Attributes ({sub.attributes.length})
                        </TabsTrigger>
                      </TabsList>

                      {/* TAB 1: PACKAGE FEATURES */}
                      <TabsContent value="features" className="pt-3 space-y-3">
                        <AddPackageFeatureForm categoryId={sub.id} />

                        {/* Feature Chip List */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {sub.packageFeatures.map((feat) => (
                            <div
                              key={feat.id}
                              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card text-xs font-semibold text-foreground border border-border shadow-xs"
                            >
                              <span>{feat.name}</span>
                              <Badge
                                variant="outline"
                                className="text-[9px] uppercase px-1 py-0"
                              >
                                {feat.type}
                              </Badge>
                              <button
                                type="button"
                                onClick={() =>
                                  deleteFeatureMutation.mutate({ id: feat.id })
                                }
                                disabled={deleteFeatureMutation.isPending}
                                className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* TAB 2: FILTER ATTRIBUTES & OPTIONS */}
                      <TabsContent
                        value="attributes"
                        className="pt-3 space-y-4"
                      >
                        <AddAttributeForm categoryId={sub.id} />

                        {/* List Attributes & Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {sub.attributes.map((attr) => (
                            <div
                              key={attr.id}
                              className="p-3 rounded-lg border border-border bg-card space-y-2.5"
                            >
                              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <Tag className="h-3.5 w-3.5 text-primary" />
                                  <span className="font-bold text-xs text-foreground">
                                    {attr.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    ({attr.slug})
                                  </span>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteAttributeMutation.mutate({
                                      id: attr.id,
                                    })
                                  }
                                  disabled={deleteAttributeMutation.isPending}
                                  className="h-6 w-6 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Option Badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {attr.options.map((opt) => (
                                  <span
                                    key={opt.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
                                  >
                                    {opt.label}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteOptionMutation.mutate({
                                          id: opt.id,
                                        })
                                      }
                                      disabled={deleteOptionMutation.isPending}
                                      className="text-muted-foreground hover:text-destructive"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>

                              {/* Inline Option Form */}
                              <AddAttributeOptionForm attributeId={attr.id} />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
