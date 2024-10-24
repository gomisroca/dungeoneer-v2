import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedSpell } from 'types';

export const spellsRouter = createTRPCRouter({
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
      const spells: ExpandedSpell[] = await ctx.db.spell.findMany({
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

      if (spells.length > limit) {
        const nextSpell = spells.pop();
        nextCursor = nextSpell!.id;
      }

      return {
        spells,
        nextCursor,
      };
    }),

  addToUser: protectedProcedure
    .input(
      z.object({
        spellId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const spell = await ctx.db.spell.findUnique({
        where: {
          id: input.spellId,
        },
        include: {
          owners: true,
        },
      });

      if (!spell) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          spells: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.spells.find((s) => s.id === spell.id)) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          spells: {
            connect: {
              id: spell.id,
            },
          },
        },
      });

      await ctx.db.spell.update({
        where: {
          id: spell.id,
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
        spellId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const spell = await ctx.db.spell.findUnique({
        where: {
          id: input.spellId,
        },
        include: {
          owners: true,
        },
      });

      if (!spell) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          spells: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!user.spells.find((s) => s.id === spell.id)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          spells: {
            disconnect: {
              id: spell.id,
            },
          },
        },
      });

      await ctx.db.spell.update({
        where: {
          id: spell.id,
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
