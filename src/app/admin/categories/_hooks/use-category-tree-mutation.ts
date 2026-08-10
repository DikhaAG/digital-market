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

export function useCategoryTreeMutation() {
  const utils = trpc.useUtils();
  const toastIdRef = useRef<string | number | null>(null);

  const createOptions = ({
    loadingMessage,
    successMessage,
    errorMessage = "Gagal memproses perubahan",
    onSuccess,
  }: MutationConfig) => ({
    onMutate: () => {
      // UX: Tampilkan loading toast secara otomatis jika loadingMessage diberikan
      if (loadingMessage) {
        toastIdRef.current = toast.loading(loadingMessage);
      }
    },
    onSuccess: () => {
      // UX: Transisi dari loading toast ke success toast
      if (toastIdRef.current) {
        toast.success(successMessage, { id: toastIdRef.current });
        toastIdRef.current = null;
      } else {
        toast.success(successMessage);
      }

      // DX: Otomatis invalidate cache tree kategori
      utils.admin.getCategoryTree.invalidate();
      onSuccess?.();
    },
    onError: (err: { message?: string }) => {
      // UX: Transisi dari loading toast ke error toast dengan pesan dari server/Zod
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
