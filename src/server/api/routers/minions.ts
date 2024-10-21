import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedMinion } from 'types';

export const minionsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const minions: ExpandedMinion[] = await ctx.db.minion.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'desc',
        },
        include: {
          owners: true,
          sources: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (minions.length > limit) {
        const nextMinion = minions.pop();
        nextCursor = nextMinion!.id;
      }

      return {
        minions,
        nextCursor,
      };
    }),

  addToUser: protectedProcedure
    .input(
      z.object({
        minionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const minion = await ctx.db.minion.findUnique({
        where: {
          id: input.minionId,
        },
        include: {
          owners: true,
        },
      });

      if (!minion) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          minions: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.minions.find((m) => m.id === minion.id)) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          minions: {
            connect: {
              id: minion.id,
            },
          },
        },
      });

      await ctx.db.minion.update({
        where: {
          id: minion.id,
        },
        data: {
          owners: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  removeFromUser: protectedProcedure
    .input(
      z.object({
        minionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const minion = await ctx.db.minion.findUnique({
        where: {
          id: input.minionId,
        },
        include: {
          owners: true,
        },
      });

      if (!minion) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          minions: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!user.minions.find((m) => m.id === minion.id)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          minions: {
            disconnect: {
              id: minion.id,
            },
          },
        },
      });

      await ctx.db.minion.update({
        where: {
          id: minion.id,
        },
        data: {
          owners: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
