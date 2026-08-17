// src/app/admin/categories/components/base-admin-dialog.tsx
"use client";

import { useState, type ReactNode, type ReactElement } from "react";
import {
  type UseFormReturn,
  type FieldValues,
  type FieldErrors,
} from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export interface BaseAdminDialogProps<TFieldValues extends FieldValues> {
  trigger: ReactElement;
  title: string;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void;
  onInvalidSubmit?: (errors: FieldErrors<TFieldValues>) => void;
  isPending: boolean;
  submitText: string;
  submitIcon?: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BaseAdminDialog<TFieldValues extends FieldValues>({
  trigger,
  title,
  description,
  form,
  onSubmit,
  onInvalidSubmit,
  isPending,
  submitText,
  submitIcon = <Sparkles className="h-4 w-4" />,
  maxWidth = "sm",
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: BaseAdminDialogProps<TFieldValues>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      setControlledOpen?.(isOpen);
    } else {
      setInternalOpen(isOpen);
    }
    if (!isOpen) form.reset();
  };

  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md md:max-w-lg",
    lg: "sm:max-w-lg md:max-w-2xl",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent
        className={cn(
          "w-[95vw] max-h-[90vh] flex flex-col rounded-2xl p-4 sm:p-6 overflow-hidden",
          maxWidthClasses[maxWidth],
        )}
      >
        <DialogHeader className="shrink-0 space-y-1 text-left border-b border-border/50 pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold truncate pr-4">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
            className="flex flex-col flex-1 overflow-hidden pt-2"
          >
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {children}
            </div>

            <DialogFooter className="shrink-0 pt-4 border-t border-border/50 mt-3">
              <Button
                type="submit"
                className="w-full font-bold gap-2 h-10 sm:h-9 rounded-xl text-xs sm:text-sm"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  submitIcon
                )}
                <span>{submitText}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
