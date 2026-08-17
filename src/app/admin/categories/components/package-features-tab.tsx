"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  packageFeatureSchema,
  type PackageFeatureInput,
} from "../_schemas/category-admin.schema";

interface PackageFeaturesTabProps {
  categoryId: string;
  features: Array<{ id: string; name: string; type: string }>;
}

export function PackageFeaturesTab({
  categoryId,
  features,
}: PackageFeaturesTabProps) {
  const utils = trpc.useUtils();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PackageFeatureInput>({
    resolver: zodResolver(packageFeatureSchema),
    defaultValues: { name: "", type: "boolean" },
  });

  const addMutation = trpc.admin.addPackageFeature.useMutation({
    onSuccess: () => {
      toast.success("Fitur paket ditambahkan");
      utils.admin.getCategoryTree.invalidate();
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (data: PackageFeatureInput) => {
    if (!categoryId) {
      toast.error("Category ID tidak valid");
      return;
    }
    addMutation.mutate({
      categoryId,
      name: data.name,
      type: data.type,
    });
  };

  const deleteMutation = trpc.admin.deletePackageFeature.useMutation({
    onSuccess: () => {
      toast.success("Fitur paket dihapus");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="pt-3 space-y-3">
      {/* Inline Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Nama fitur (Contoh: Vector file, Revisions)"
            {...register("name")}
            className="h-8 text-xs max-w-xs"
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? "boolean"}
              >
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boolean">Boolean (✓ / ✗)</SelectItem>
                  <SelectItem value="number">Number (Angka)</SelectItem>
                  <SelectItem value="text">Text (Kustom)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 text-xs font-semibold"
            disabled={addMutation.isPending || !categoryId}
          >
            {addMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Fitur
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

      {/* List Features */}
      <div className="flex flex-wrap gap-2 pt-1">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card text-xs font-semibold text-foreground border border-border shadow-xs"
          >
            <span>{feat.name}</span>
            <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">
              {feat.type}
            </Badge>
            <button
              type="button"
              onClick={() => deleteMutation.mutate({ id: feat.id })}
              disabled={deleteMutation.isPending}
              className="text-muted-foreground hover:text-destructive transition-colors ml-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
