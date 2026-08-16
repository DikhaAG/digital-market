// src/lib/trpc/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { headers as getNextHeaders } from "next/headers";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  // Ambil request headers dari Fetch Adapter (API Route) atau dari Next.js RSC context (Server Caller)
  const reqHeaders = opts?.req.headers ?? (await getNextHeaders());
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  return {
    headers: reqHeaders,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

// ----------------------------------------------------------------------------
// MIDDLEWARE: LOGGING & MONITORING
// ----------------------------------------------------------------------------
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
    logger.error({
      message: `tRPC Failure: ${path}`,
      error: result.error,
      ...meta,
    });
  } else if (durationMs > 500) {
    logger.warn({
      message: `Slow tRPC Procedure (>500ms): ${path}`,
      ...meta,
    });
  } else {
    logger.info({
      message: `tRPC Succeeded: ${path}`,
      ...meta,
    });
  }
  return result;
});

// ----------------------------------------------------------------------------
// MIDDLEWARE: RBAC ACCESS CONTROL
// ----------------------------------------------------------------------------
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sesi login tidak valid atau telah berakhir",
    });
  }

  if (ctx.session.user.banned) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akun Anda telah ditangguhkan. Hubungi Super Admin.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (
    !ctx.session?.user ||
    !["admin", "super_admin"].includes(ctx.session.user.role)
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses ditolak: Membutuhkan hak akses Administrator",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

const isSuperAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "super_admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses terbatas: Fitur ini khusus untuk Super Admin",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

// ----------------------------------------------------------------------------
// PROCEDURES
// ----------------------------------------------------------------------------
export const router = t.router;
export const publicProcedure = t.procedure.use(loggerMiddleware);
export const protectedProcedure = t.procedure
  .use(isAuthed)
  .use(loggerMiddleware);
export const adminProcedure = t.procedure
  .use(isAuthed)
  .use(isAdmin)
  .use(loggerMiddleware);
export const superAdminProcedure = t.procedure
  .use(isAuthed)
  .use(isSuperAdmin)
  .use(loggerMiddleware);
export const createCallerFactory = t.createCallerFactory;
