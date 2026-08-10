"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

interface MutationConfig {
  successMessage: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export function useCategoryTreeMutation() {
  const utils = trpc.useUtils();

  const createOptions = ({
    successMessage,
    errorMessage = "Gagal memproses perubahan",
    onSuccess,
  }: MutationConfig) => ({
    onSuccess: () => {
      toast.success(successMessage);
      utils.admin.getCategoryTree.invalidate();
      onSuccess?.();
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || errorMessage);
    },
  });

  return { trpc, createOptions };
}
