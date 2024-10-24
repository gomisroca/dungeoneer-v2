import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedCard } from 'types';

export const cardsRouter = createTRPCRouter({
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
      const cards: ExpandedCard[] = await ctx.db.card.findMany({
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

      if (cards.length > limit) {
        const nextCard = cards.pop();
        nextCursor = nextCard!.id;
      }

      return {
        cards,
        nextCursor,
      };
    }),

  addToUser: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.card.findUnique({
        where: {
          id: input.cardId,
        },
        include: {
          owners: true,
        },
      });

      if (!card) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          cards: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.cards.find((c) => c.id === card.id)) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          cards: {
            connect: {
              id: card.id,
            },
          },
        },
      });

      await ctx.db.card.update({
        where: {
          id: card.id,
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
        cardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.card.findUnique({
        where: {
          id: input.cardId,
        },
        include: {
          owners: true,
        },
      });

      if (!card) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          cards: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!user.cards.find((c) => c.id === card.id)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          cards: {
            disconnect: {
              id: card.id,
            },
          },
        },
      });

      await ctx.db.card.update({
        where: {
          id: card.id,
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
