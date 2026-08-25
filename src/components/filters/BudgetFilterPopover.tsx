//src/components/filters/BudgetFilterPopover.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

const budgetSchema = z.object({
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

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

  const { register, handleSubmit } = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    values: { minPrice, maxPrice },
  });

  const onSubmit = (data: BudgetValues) => {
    setOpen(false);
    onApply(data.minPrice || null, data.maxPrice || null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="rounded-xl border-border font-semibold text-sm h-10 px-4 hover:border-foreground transition-all gap-2 cursor-pointer"
          >
            Budget
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4 rounded-2xl" align="start">
        <div className="font-bold text-sm">Budget Range</div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="minPrice"
                className="text-xs text-muted-foreground"
              >
                MIN ($)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Any"
                {...register("minPrice")}
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="maxPrice"
                className="text-xs text-muted-foreground"
              >
                MAX ($)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Any"
                {...register("maxPrice")}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl cursor-pointer"
          >
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
