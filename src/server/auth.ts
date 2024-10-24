import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import DiscordProvider from 'next-auth/providers/discord';

import { env } from '@/env';
import { db } from '@/server/db';
import { type Card, type Mount, type Orchestrion, type Spell, type Minion } from '@prisma/client';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      minions: Minion[];
      mounts: Mount[];
      orchestrions: Orchestrion[];
      spells: Spell[];
      cards: Card[];
    } & DefaultSession['user'];
  }

  interface User {
    minions: Minion[];
    mounts: Mount[];
    orchestrions: Orchestrion[];
    spells: Spell[];
    cards: Card[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          minions: true,
          mounts: true,
          orchestrions: true,
          spells: true,
          cards: true,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: dbUser?.id ?? user.id,
          minions: dbUser?.minions ?? [],
          mounts: dbUser?.mounts ?? [],
          orchestrions: dbUser?.orchestrions ?? [],
          spells: dbUser?.spells ?? [],
          cards: dbUser?.cards ?? [],
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
