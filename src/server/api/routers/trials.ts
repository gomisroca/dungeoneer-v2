import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type Trial } from '@prisma/client';
export const trialsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const trials: Trial[] = await ctx.db.trial.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Map over each raid to fetch associated minions, mounts, orchestrions, spells, cards, hairstyles and emotes
      const expandedTrials = await Promise.all(
        trials.map(async (trial) => {
          const minions = await ctx.db.minion.findMany({
            where: {
              sources: {
                some: {
                  type: 'Trial',
                  text: {
                    equals: trial.name,
                    mode: 'insensitive',
                  },
                },
              },
            },
            include: {
              sources: true,
              owners: true,
            },
          });
          const mounts = await ctx.db.mount.findMany({
            where: {
              sources: {
                some: {
                  type: 'Trial',
                  text: {
                    equals: trial.name,
                    mode: 'insensitive',
                  },
                },
              },
            },
            include: {
              sources: true,
              owners: true,
            },
          });

          const orchestrions = await ctx.db.orchestrion.findMany({
            where: {
              sources: {
                some: {
                  text: {
                    contains: trial.name,
                    mode: 'insensitive',
                  },
                },
              },
            },
            include: {
              sources: true,
              owners: true,
            },
          });

          const spells = await ctx.db.spell.findMany({
            where: {
              sources: {
                some: {
                  text: {
                    contains: trial.name,
                    mode: 'insensitive',
                  },
                },
              },
            },
            include: {
              sources: true,
              owners: true,
            },
          });

          const cards = await ctx.db.card.findMany({
            where: {
              sources: {
                some: {
                  text: {
                    contains: trial.name,
                    mode: 'insensitive',
                  },
                },
              },
            },
            include: {
              sources: true,
              owners: true,
            },
          });

          return {
            ...trial,
            minions,
            mounts,
            orchestrions,
            spells,
            cards,
          };
        })
      );

      let nextCursor: typeof cursor | undefined = undefined;

      if (trials.length > limit) {
        const nextTrial = trials.pop();
        nextCursor = nextTrial!.id;
      }

      return {
        trials: expandedTrials.slice(0, limit),
        nextCursor,
      };
    }),

  getUnique: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const trial = await ctx.db.trial.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!trial) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const minions = await ctx.db.minion.findMany({
        where: {
          sources: {
            some: {
              type: 'Trial',
              text: {
                equals: trial.name,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });
      const mounts = await ctx.db.mount.findMany({
        where: {
          sources: {
            some: {
              type: 'Trial',
              text: {
                equals: trial.name,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });
      const orchestrions = await ctx.db.orchestrion.findMany({
        where: {
          sources: {
            some: {
              text: {
                contains: trial.name,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });

      return { ...trial, minions, mounts, orchestrions };
    }),
});
