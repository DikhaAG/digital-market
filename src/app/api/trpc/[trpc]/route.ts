import { appRouter } from "@/lib/trpc/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}), // Tempat menaruh data session/auth nantinya
  });

export { handler as GET, handler as POST };
