import { initTRPC } from "@trpc/server";

// Inisialisasi tRPC Server
const t = initTRPC.create();

// Ekspor utilitas dasar
export const router = t.router;
export const publicProcedure = t.procedure;
