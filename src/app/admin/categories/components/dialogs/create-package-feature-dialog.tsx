"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseAdminDialog } from "../base-admin-dialog";
import {
  packageFeatureSchema,
  type PackageFeatureInput,
} from "../../_schemas/category-admin.schema";

interface CreatePackageFeatureDialogProps {
  categoryId: string;
}

export function CreatePackageFeatureDialog({
  categoryId,
}: CreatePackageFeatureDialogProps) {
  const utils = trpc.useUtils();
  const form = useForm<PackageFeatureInput>({
    resolver: zodResolver(packageFeatureSchema),
    defaultValues: { name: "", type: "boolean" },
  });

  const mutation = trpc.admin.addPackageFeature.useMutation({
    onSuccess: () => {
      toast.success("Fitur komparasi paket berhasil ditambahkan");
      utils.admin.getCategoryTree.invalidate();
    },
    onError: (err) => toast.error(err.message || "Gagal menambah fitur paket"),
  });

  return (
    <BaseAdminDialog
      trigger={
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 font-medium"
        >
          <CheckSquare className="h-3.5 w-3.5 text-primary" />
          <span>Tambah Fitur Paket</span>
        </Button>
      }
      title="Tambah Feature Checklist Paket"
      form={form}
      onSubmit={(data) =>
        mutation.mutate({ categoryId, name: data.name, type: data.type })
      }
      isPending={mutation.isPending}
      submitText="Simpan Fitur Paket"
      submitIcon={null}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Nama Item Fitur
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Source File, High Res" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
              Tipe Fitur
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="type"
                render={({ field: selectField }) => (
                  <Select
                    onValueChange={selectField.onChange}
                    value={selectField.value}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Pilih tipe fitur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boolean">
                        Boolean (Centang ✓ / Silang ✗)
                      </SelectItem>
                      <SelectItem value="text">
                        Teks Kustom (Contoh: &quot;1080p&quot;, &quot;4K&quot;)
                      </SelectItem>
                      <SelectItem value="number">
                        Angka Kustom (Contoh: Jumlah Konsep = 3)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </BaseAdminDialog>
  );
}
