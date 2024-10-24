'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import Image from 'next/image';
import { type ExpandedDungeon } from 'types';
import { type Session } from 'next-auth';
import MinionSelector from '../_components/MinionSelector';
import MountSelector from '../_components/MountSelector';
import OrchestrionSelector from '../_components/OrchestrionSelector';
import { twMerge } from 'tailwind-merge';
import checkOwnership from '@/utils/checkOwnership';
import SpellSelector from '../_components/SpellSelector';
import CardSelector from '../_components/CardSelector';

function VariantDungeonCard({ dungeon, session }: { dungeon: ExpandedDungeon; session: Session | null }) {
  const allOwned = checkOwnership(dungeon, session);
  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700',
        allOwned && 'opacity-50 hover:opacity-100'
      )}>
      {allOwned && (
        <div className="absolute right-[-25px] top-[-25px] flex contrast-200">
          <span className="m-auto text-8xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      {dungeon.image && (
        <Image
          unoptimized
          src={dungeon.image}
          alt={dungeon.name}
          width={300}
          height={100}
          className="w-full object-cover"
        />
      )}
      <h1 className="line-clamp-2 text-center text-xl">{dungeon.name[0]?.toUpperCase() + dungeon.name.slice(1)}</h1>
      <div className="flex flex-col gap-2">
        {dungeon.minions.length > 0 && <MinionSelector minions={dungeon.minions} session={session} />}
        {dungeon.mounts.length > 0 && <MountSelector mounts={dungeon.mounts} session={session} />}
        {dungeon.orchestrions.length > 0 && (
          <OrchestrionSelector orchestrions={dungeon.orchestrions} session={session} />
        )}
        {dungeon.spells.length > 0 && <SpellSelector spells={dungeon.spells} session={session} />}
        {dungeon.cards.length > 0 && <CardSelector cards={dungeon.cards} session={session} />}
      </div>
    </div>
  );
}

type VariantDungeonListOutput = RouterOutputs['variants']['getAll'];
interface VariantDungeonListProps {
  initialDungeons: VariantDungeonListOutput;
  session: Session | null;
}
export default function VariantDungeonList({ initialDungeons, session }: VariantDungeonListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.variants.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialDungeons], pageParams: [undefined] },
    }
  );

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching dungeons</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" key={i}>
              {page.dungeons.map((dungeon, index) => (
                <div key={dungeon.id} ref={index === page.dungeons.length - 1 ? ref : undefined}>
                  <VariantDungeonCard dungeon={dungeon} session={session} />
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-cyan-300 p-4 text-center text-xl font-bold dark:bg-cyan-700">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
