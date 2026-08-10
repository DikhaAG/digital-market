// src/lib/trpc/trpc.ts

import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { logger } from "@/lib/logger"; // 👈 Import logger terpusat

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  return {
    headers: opts?.req.headers,
    session: { user: { id: "admin_id", role: "ADMIN" } },
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

// ============================================================================
// MIDDLEWARE: SERVER LOGGING & PERFORMANCE MONITORING
// ============================================================================
const loggerMiddleware = t.middleware(async ({ path, type, next, ctx }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  const meta = {
    path,
    type,
    durationMs,
    userId: ctx.session?.user?.id ?? "anonymous",
  };

  if (!result.ok) {
    // Log error (Termasuk Validation Error Zod 400 Bad Request)
    logger.error({
      message: `tRPC Procedure Failed: ${path}`,
      error: result.error,
      ...meta,
    });
  } else if (durationMs > 500) {
    // Deteksi otomatis query lambat seperti getCategoryTree (2.4s)
    logger.warn({
      message: `Slow tRPC Procedure Detected (>500ms): ${path}`,
      ...meta,
    });
  } else {
    // Log sukses standar
    logger.info({
      message: `tRPC Request Succeeded: ${path}`,
      ...meta,
    });
  }

  return result;
});

// Middleware Autentikasi
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Anda harus login terlebih dahulu",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

// Middleware Admin
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses khusus Administrator",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

export const router = t.router;
export const publicProcedure = t.procedure.use(loggerMiddleware);
export const protectedProcedure = t.procedure
  .use(isAuthed)
  .use(loggerMiddleware);
export const adminProcedure = t.procedure.use(isAdmin).use(loggerMiddleware);
export const createCallerFactory = t.createCallerFactory;
