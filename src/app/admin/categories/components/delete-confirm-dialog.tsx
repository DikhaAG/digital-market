"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteConfirmDialog({
  title,
  description,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label={title}
            title={title}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      ></AlertDialogTrigger>

      <AlertDialogContent className="max-w-[95vw] sm:max-w-lg rounded-2xl p-4 sm:p-6">
        <AlertDialogHeader className="space-y-3 text-left">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-base sm:text-lg font-bold text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-6">
          <AlertDialogCancel className="w-full sm:w-auto h-9 text-xs sm:text-sm rounded-xl font-medium mt-0">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="w-full sm:w-auto h-9 text-xs sm:text-sm rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 shrink-0" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
