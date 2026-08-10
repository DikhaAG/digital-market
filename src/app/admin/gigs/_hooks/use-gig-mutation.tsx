"use client";

import { useRef } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

interface MutationConfig {
  loadingMessage?: string;
  successMessage: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export function useGigMutation() {
  const utils = trpc.useUtils();
  const toastIdRef = useRef<string | number | null>(null);

  const createOptions = ({
    loadingMessage,
    successMessage,
    errorMessage = "Gagal memproses perubahan Gig",
    onSuccess,
  }: MutationConfig) => ({
    onMutate: () => {
      if (loadingMessage) {
        toastIdRef.current = toast.loading(loadingMessage);
      }
    },
    onSuccess: () => {
      if (toastIdRef.current) {
        toast.success(successMessage, { id: toastIdRef.current });
        toastIdRef.current = null;
      } else {
        toast.success(successMessage);
      }
      // Otomatis invalidate cache list audit Gig dan pohon kategori[cite: 23]
      utils.admin.getGigsForAudit.invalidate();
      utils.admin.getCategoryTree.invalidate();
      onSuccess?.();
    },
    onError: (err: { message?: string }) => {
      const detailMessage = err.message || errorMessage;
      if (toastIdRef.current) {
        toast.error(detailMessage, { id: toastIdRef.current });
        toastIdRef.current = null;
      } else {
        toast.error(detailMessage);
      }
    },
  });

  return { trpc, createOptions };
}
