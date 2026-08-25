// src/components/filters/BudgetFilterPopover.tsx
"use client";

import { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Schema Validasi Aturan Bisnis (Business Logic Guardrail)
const budgetSchema = z
  .object({
    minPrice: z
      .string()
      .optional()
      .refine(
        (val) => !val || Number(val) >= 0,
        "Harga minimum tidak boleh negatif",
      ),
    maxPrice: z
      .string()
      .optional()
      .refine(
        (val) => !val || Number(val) >= 0,
        "Harga maksimum tidak boleh negatif",
      ),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return Number(data.minPrice) <= Number(data.maxPrice);
      }
      return true;
    },
    {
      message: "Harga minimum tidak boleh lebih besar dari maksimum",
      path: ["maxPrice"],
    },
  );

type BudgetValues = z.infer<typeof budgetSchema>;

interface BudgetFilterPopoverProps {
  minPrice: string;
  maxPrice: string;
  isPending: boolean;
  onApply: (minPrice: string | null, maxPrice: string | null) => void;
}

export function BudgetFilterPopover({
  minPrice,
  maxPrice,
  isPending,
  onApply,
}: BudgetFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    values: { minPrice, maxPrice },
  });

  const onSubmit = (data: BudgetValues) => {
    setOpen(false);
    onApply(data.minPrice || null, data.maxPrice || null);
  };

  const hasActiveBudget = Boolean(minPrice || maxPrice);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant={hasActiveBudget ? "default" : "outline"}
            className="rounded-xl border-border font-semibold text-sm h-10 px-4 transition-all gap-2 cursor-pointer"
          >
            <span>Budget</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 space-y-4 rounded-2xl shadow-xl"
        align="start"
      >
        <div className="space-y-1 border-b border-border/60 pb-2">
          <h4 className="font-bold text-sm text-foreground">Rentang Budget</h4>
          <p className="text-xs text-muted-foreground">
            Tentukan batas harga minimum dan maksimum ($)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="minPrice"
                className="text-xs text-muted-foreground font-semibold"
              >
                MIN ($)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Any"
                {...register("minPrice")}
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="maxPrice"
                className="text-xs text-muted-foreground font-semibold"
              >
                MAX ($)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Any"
                {...register("maxPrice")}
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          {/* Render Error Validasi Aturan Bisnis */}
          {(errors.minPrice || errors.maxPrice) && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {errors.maxPrice?.message || errors.minPrice?.message}
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl font-bold cursor-pointer"
          >
            Terapkan Budget
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
