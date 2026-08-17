"use client";

import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Tag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  attributeSchema,
  attributeOptionSchema,
  type AttributeInput,
  type AttributeOptionInput,
  type AttributeItem,
  type AttributeOptionItem,
} from "../_schemas/category-admin.schema";
import { useCategoryActions } from "../_hooks/use-category-actions";

interface FilterAttributesTabProps {
  categoryId: string;
  attributes: AttributeItem[];
}

export function FilterAttributesTab({
  categoryId,
  attributes,
}: FilterAttributesTabProps) {
  const { handleCreateAttribute, isCreatingAttribute } = useCategoryActions();

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
    handleCreateAttribute(categoryId, data.name, () => reset());
  };

  return (
    <div className="pt-3 space-y-4">
      {/* Inline Form: Tambah Atribut */}
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

      {/* Grid Atribut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {attributes.map((attr) => (
          <AttributeCardItem key={attr.id} attr={attr} />
        ))}
      </div>
    </div>
  );
}

const AttributeCardItem = memo(function AttributeCardItem({
  attr,
}: {
  attr: AttributeItem;
}) {
  const { deleteAttribute, isDeletingAttribute, deletingAttributeId } =
    useCategoryActions();
  const isDeletingThisAttr =
    isDeletingAttribute && deletingAttributeId === attr.id;

  return (
    <div className="p-3 rounded-lg border border-border bg-card space-y-2.5">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-bold text-xs text-foreground truncate">
            {attr.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            ({attr.slug})
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Hapus atribut ${attr.name}`}
          onClick={() => deleteAttribute({ id: attr.id })}
          disabled={isDeletingThisAttr}
          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
        >
          {isDeletingThisAttr ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </div>

      <AttributeOptionsList attributeId={attr.id} options={attr.options} />
    </div>
  );
});

const AttributeOptionsList = memo(function AttributeOptionsList({
  attributeId,
  options,
}: {
  attributeId: string;
  options: AttributeOptionItem[];
}) {
  const {
    handleCreateAttributeOption,
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
  } = useForm<AttributeOptionInput>({
    resolver: zodResolver(attributeOptionSchema),
    defaultValues: { label: "" },
  });

  const onAddOption = (data: AttributeOptionInput) => {
    if (!attributeId || !data.label) return;
    handleCreateAttributeOption(attributeId, data.label, data.value, () =>
      reset(),
    );
  };

  return (
    <div className="space-y-2">
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

      {/* Inline Form: Tambah Opsi */}
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
});
