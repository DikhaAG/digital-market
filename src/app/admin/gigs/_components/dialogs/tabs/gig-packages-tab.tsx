"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { type GigFormValues } from "../../../_schemas/gig-admin-schema";

interface GigPackagesTabProps {
  form: UseFormReturn<GigFormValues>;
  packageFeatures?: Array<{
    id: string;
    name: string;
    type: "boolean" | "text" | "number";
  }>;
}

export function GigPackagesTab({ form, packageFeatures }: GigPackagesTabProps) {
  const packagesWatch =
    useWatch({ control: form.control, name: "packages" }) ?? [];

  return (
    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 pt-3">
      {(["basic", "standard", "premium"] as const).map((pType, pIdx) => (
        <div
          key={pType}
          className="p-3.5 rounded-xl border border-border bg-card space-y-3 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Badge
              variant={pType === "basic" ? "default" : "outline"}
              className="uppercase text-[10px] font-extrabold px-2 py-0.5"
            >
              {pType} Package
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name={`packages.${pIdx}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                    Judul Paket
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Judul Paket"
                      className="h-8 text-xs"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`packages.${pIdx}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                    Harga ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Harga ($)"
                      className="h-8 text-xs"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name={`packages.${pIdx}.deliveryTimeDays`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                    Waktu Pengerjaan (Hari)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 1)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`packages.${pIdx}.revisions`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">
                    Jumlah Revisi
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Checklist Matriks Fitur */}
          {packageFeatures && packageFeatures.length > 0 && (
            <div className="border-t border-border/60 pt-3 space-y-2">
              <span className="text-[11px] font-extrabold text-foreground block">
                Fitur Matriks [packageFeatures]:
              </span>

              <div className="space-y-2">
                {packageFeatures.map((feat) => {
                  const currentFV = packagesWatch[pIdx]?.featureValues ?? [];
                  const existIdx = currentFV.findIndex(
                    (fv) => fv.packageFeatureId === feat.id,
                  );
                  const isIncluded =
                    existIdx !== -1 ? currentFV[existIdx]?.isIncluded : false;
                  const customValue =
                    existIdx !== -1 ? (currentFV[existIdx]?.value ?? "") : "";

                  const handleToggleChange = (checked: boolean) => {
                    const updatedFV = [...currentFV];
                    if (existIdx !== -1) {
                      updatedFV[existIdx] = {
                        ...updatedFV[existIdx],
                        isIncluded: checked,
                      };
                    } else {
                      updatedFV.push({
                        packageFeatureId: feat.id,
                        isIncluded: checked,
                        value: null,
                      });
                    }
                    form.setValue(`packages.${pIdx}.featureValues`, updatedFV);
                  };

                  const handleValueChange = (val: string) => {
                    const updatedFV = [...currentFV];
                    if (existIdx !== -1) {
                      updatedFV[existIdx] = {
                        ...updatedFV[existIdx],
                        value: val,
                      };
                    } else {
                      updatedFV.push({
                        packageFeatureId: feat.id,
                        isIncluded: true,
                        value: val,
                      });
                    }
                    form.setValue(`packages.${pIdx}.featureValues`, updatedFV);
                  };

                  return (
                    <div
                      key={feat.id}
                      className="p-2 rounded-lg border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground truncate block">
                          {feat.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          Tipe: {feat.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {(feat.type === "text" || feat.type === "number") && (
                          <Input
                            type={feat.type === "number" ? "number" : "text"}
                            placeholder={
                              feat.type === "number" ? "Jml" : "Nilai"
                            }
                            value={customValue}
                            disabled={!isIncluded}
                            onChange={(e) => handleValueChange(e.target.value)}
                            className="h-7 w-20 text-[11px]"
                          />
                        )}

                        <Switch
                          checked={isIncluded ?? false}
                          onCheckedChange={handleToggleChange}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
