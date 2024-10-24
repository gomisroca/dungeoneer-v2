import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type VariantDungeon } from '@prisma/client';

export const variantsRouter = createTRPCRouter({
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

      const dungeons: VariantDungeon[] = await ctx.db.variantDungeon.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Map over each raid to fetch associated minions, mounts, orchestrions, spells, cards, hairstyles and emotes
      const expandedDungeons = await Promise.all(
        dungeons.map(async (dungeon) => {
          const minions = await ctx.db.minion.findMany({
            where: {
              sources: {
                some: {
                  type: 'V&C Dungeon',
                  text: {
                    contains: dungeon.name,
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
                  type: 'V&C Dungeon',
                  text: {
                    contains: dungeon.name,
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
                  type: 'V&C Dungeon',
                  text: {
                    contains: dungeon.name,
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
                    contains: dungeon.name,
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
                    contains: dungeon.name,
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
            ...dungeon,
            minions,
            mounts,
            orchestrions,
            spells,
            cards,
          };
        })
      );

      let nextCursor: typeof cursor | undefined = undefined;

      if (dungeons.length > limit) {
        const nextDungeon = dungeons.pop();
        nextCursor = nextDungeon!.id;
      }

      return {
        dungeons: expandedDungeons.slice(0, limit),
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
      const dungeon = await ctx.db.variantDungeon.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!dungeon) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const minions = await ctx.db.minion.findMany({
        where: {
          sources: {
            some: {
              type: 'V&C Dungeon',
              text: {
                contains: dungeon.name,
                mode: 'insensitive', // Optional: to make the search case-insensitive
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
              type: 'V&C Dungeon',
              text: {
                contains: dungeon.name,
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
                contains: dungeon.name,
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

      return { ...dungeon, minions, mounts, orchestrions };
    }),
});
