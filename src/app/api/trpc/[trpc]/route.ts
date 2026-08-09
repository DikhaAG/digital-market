//src/app/api/trpc/[trpc]/route.ts
import { createTRPCContext } from "@/lib/trpc/trpc";
import { appRouter } from "@/server/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext, // 👈 Terhubungkan secara strictly-typed dengan req & headers
  });

export { handler as GET, handler as POST };
