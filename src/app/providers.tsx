"use client";

import { trpc } from "@/lib/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
// import superjson from "superjson"; // Un-comment jika di server tRPC menggunakan superjson

/**
 * Menentukan Base URL secara dinamis:
 * - Browser: Gunakan relative path "" (otomatis ikut domain aktif)
 * - Server (Vercel): Gunakan VERCEL_URL
 * - Server (Local): Gunakan localhost:3000
 */
function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // 1. Inisialisasi QueryClient dengan konfigurasi performa
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Mencegah query di-fetch ulang secara agresif saat window regain focus
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // 2. Inisialisasi tRPC Client dengan URL dinamis
  const [trpcClient] = useState(() =>
    trpc.createClient({
      // transformer: superjson, // Aktifkan jika server menggunakan transformer superjson
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
