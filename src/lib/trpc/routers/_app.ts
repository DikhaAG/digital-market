import { router } from "../trpc";
import { categoryRouter } from "./category";
import { gigRouter } from "./gig";

export const appRouter = router({
  gig: gigRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
