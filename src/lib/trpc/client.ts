// src/lib/trpc/client.ts
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "./routers/_app";

export const trpc = createTRPCReact<AppRouter>();
