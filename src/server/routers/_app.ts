//src/lib/trpc/routers/_app.ts
import { router } from "@/lib/trpc/trpc";
import { adminRouter } from "./admin";
import { categoryRouter } from "./category";
import { gigRouter } from "./gig";
import { uploadRouter } from "./upload";

export const appRouter = router({
  gig: gigRouter,
  category: categoryRouter,
  admin: adminRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
