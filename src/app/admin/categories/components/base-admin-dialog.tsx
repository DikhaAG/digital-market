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
  maxWidth?: "sm" | "md";
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent
        className={maxWidth === "md" ? "sm:max-w-md" : "sm:max-w-sm"}
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-bold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
            className="space-y-4 pt-2"
          >
            {children}
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full font-bold gap-2"
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
