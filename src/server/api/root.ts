import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { minionsRouter } from '@/server/api/routers/minions';
import { mountsRouter } from './routers/mounts';

import { dungeonsRouter } from './routers/dungeons';
import { raidsRouter } from './routers/raids';
import { trialsRouter } from './routers/trials';
import { orchestrionsRouter } from './routers/orchestrions';
import { spellsRouter } from './routers/spells';
import { cardsRouter } from './routers/cards';
import { variantsRouter } from './routers/variants';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  minions: minionsRouter,
  mounts: mountsRouter,
  orchestrions: orchestrionsRouter,
  spells: spellsRouter,
  cards: cardsRouter,
  dungeons: dungeonsRouter,
  variants: variantsRouter,
  raids: raidsRouter,
  trials: trialsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
