import { router } from "../trpc";
import { adminRouter } from "./admin";
import { categoryRouter } from "./category";
import { gigRouter } from "./gig";

export const appRouter = router({
  gig: gigRouter,
  category: categoryRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
