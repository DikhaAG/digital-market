// src/app/admin/categories/components/filter-attributes-tab.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Tag, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  attributeSchema,
  attributeOptionFormSchema,
  slugify,
  type AttributeInput,
  type AttributeOptionFormInput,
} from "../_schemas/category-admin.schema";
import { useCategoryActions } from "../_hooks/use-category-actions";

interface AttributeOption {
  id: string;
  label: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  slug: string;
  options: AttributeOption[];
}

export function FilterAttributesTab({
  categoryId,
  attributes,
}: {
  categoryId: string;
  attributes: Attribute[];
}) {
  const {
    createAttribute,
    isCreatingAttribute,
    deleteAttribute,
    isDeletingAttribute,
    deletingAttributeId,
  } = useCategoryActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttributeInput>({
    resolver: zodResolver(attributeSchema),
    defaultValues: { name: "" },
  });

  const onAddAttribute = (data: AttributeInput) => {
    if (!categoryId) return;
    createAttribute({
      categoryId,
      name: data.name,
      slug: slugify(data.name),
    });
    reset();
  };

  return (
    <div className="pt-3 space-y-4">
      {/* Form Tambah Atribut */}
      <form onSubmit={handleSubmit(onAddAttribute)} className="space-y-1">
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
            disabled={isCreatingAttribute}
          >
            {isCreatingAttribute ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Atribut
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

      {/* Grid Daftar Atribut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {attributes.map((attr) => {
          const isDeletingThisAttr =
            isDeletingAttribute && deletingAttributeId === attr.id;

          return (
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
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({attr.slug})
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Hapus atribut ${attr.name}`}
                  onClick={() => deleteAttribute({ id: attr.id })}
                  disabled={isDeletingThisAttr}
                  className="text-muted-foreground hover:text-destructive p-1 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isDeletingThisAttr ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </button>
              </div>

              <AttributeOptionsList
                attributeId={attr.id}
                options={attr.options}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttributeOptionsList({
  attributeId,
  options,
}: {
  attributeId: string;
  options: AttributeOption[];
}) {
  const {
    createAttributeOption,
    isCreatingAttributeOption,
    deleteAttributeOption,
    isDeletingAttributeOption,
    deletingOptionId,
  } = useCategoryActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttributeOptionFormInput>({
    resolver: zodResolver(attributeOptionFormSchema),
    defaultValues: { label: "" },
  });

  const onAddOption = (data: AttributeOptionFormInput) => {
    if (!attributeId || !data.label) return;
    createAttributeOption({
      attributeId,
      label: data.label,
      value: slugify(data.label),
    });
    reset();
  };

  return (
    <div className="space-y-2">
      {/* List Badge Opsi */}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isDeletingThisOpt =
            isDeletingAttributeOption && deletingOptionId === opt.id;

          return (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
            >
              {opt.label}
              <button
                type="button"
                aria-label={`Hapus opsi ${opt.label}`}
                onClick={() => deleteAttributeOption({ id: opt.id })}
                disabled={isDeletingThisOpt}
                className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeletingThisOpt ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <X className="h-2.5 w-2.5" />
                )}
              </button>
            </span>
          );
        })}
      </div>

      {/* Form Tambah Opsi */}
      <form onSubmit={handleSubmit(onAddOption)} className="space-y-1 pt-1">
        <div className="flex items-center gap-1.5">
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
            disabled={isCreatingAttributeOption}
          >
            {isCreatingAttributeOption ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Tambah"
            )}
          </Button>
        </div>
        {errors.label && (
          <p className="text-[10px] text-destructive font-medium">
            {errors.label.message}
          </p>
        )}
      </form>
    </div>
  );
}
