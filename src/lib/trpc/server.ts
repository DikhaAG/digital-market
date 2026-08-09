//src/lib/trpc/server.ts
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "@/lib/trpc/trpc";
import { appRouter } from "@/server/routers/_app";

const createCaller = createCallerFactory(appRouter);

export const trpcServer = cache(async () => {
  const context = await createTRPCContext();
  return createCaller(context);
});
