// src/lib/trpc/trpc.ts
import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

// 1. Definisikan Context (Session, DB, Headers, dll)
export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  return {
    headers: opts?.req.headers,
  };
}

// FIX: Menambahkan ReturnType<typeof createTRPCContext> di dalam Awaited<...>
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// FIX: Menambahkan <Context> pada fungsi .context()
const t = initTRPC.context<Context>().create();

// 3. Ekspor Utilitas Utama
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
