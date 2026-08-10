// src/app/admin/gigs/_components/dialogs/tabs/gig-attributes-tab.tsx
"use client";

import { Check } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { type GigFormValues } from "../../../_schemas/gig-admin-schema";

interface GigAttributesTabProps {
  attributes?: Array<{
    id: string;
    name: string;
    options: Array<{ id: string; label: string }>;
  }>;
}

export function GigAttributesTab({ attributes }: GigAttributesTabProps) {
  const { control, setValue } = useFormContext<GigFormValues>();
  const attributeOptionIds =
    useWatch({ control, name: "attributeOptionIds" }) ?? [];

  if (!attributes || attributes.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-xl bg-muted/20 my-3">
        <p className="text-xs text-muted-foreground italic">
          Tidak ada atribut filter kustom untuk kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[60vh] sm:max-h-[380px] overflow-y-auto pr-1 pt-3">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className="p-3 rounded-xl border border-border/80 bg-card/60 space-y-2"
        >
          <span className="font-bold text-xs text-foreground block">
            {attr.name}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {attr.options.map((opt) => {
              const isChecked = attributeOptionIds.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  aria-pressed={isChecked}
                  onClick={() => {
                    if (isChecked) {
                      setValue(
                        "attributeOptionIds",
                        attributeOptionIds.filter((id) => id !== opt.id),
                      );
                    } else {
                      setValue("attributeOptionIds", [
                        ...attributeOptionIds,
                        opt.id,
                      ]);
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isChecked
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/50 border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 shrink-0" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
