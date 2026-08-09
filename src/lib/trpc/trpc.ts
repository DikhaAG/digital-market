//src/lib/trpc/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  // Asumsi: Ambil session dari auth provider (e.g., Better Auth / NextAuth)
  return {
    headers: opts?.req.headers,
    // session: null as { user?: { id: string; role: string } } | null, // Sesuaikan dengan Auth Context Anda
    session: { user: { id: "admin_id", role: "ADMIN" } }, // untuk development agar tetap dapat login sebagai admin
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

// Middleware: Memastikan Pengguna Sudah Login
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Anda harus login terlebih dahulu",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

// Middleware: Memastikan Pengguna Memiliki Role ADMIN
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
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
export const createCallerFactory = t.createCallerFactory;
