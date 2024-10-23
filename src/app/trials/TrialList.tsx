'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import Image from 'next/image';
import { type ExpandedTrial } from 'types';
import { type Session } from 'next-auth';
import MinionSelector from '../_components/MinionSelector';
import MountSelector from '../_components/MountSelector';

function TrialCard({ trial, session }: { trial: ExpandedTrial; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700">
      {trial.image && (
        <Image src={trial.image} alt={trial.name} width={300} height={100} className="w-full object-cover" />
      )}
      <h1 className="line-clamp-2 text-center text-xl">{trial.name[0]?.toUpperCase() + trial.name.slice(1)}</h1>
      <MinionSelector minions={trial.minions} session={session} />
      <MountSelector mounts={trial.mounts} session={session} />
    </div>
  );
}

type TrialListtOutput = RouterOutputs['trials']['getAll'];
interface TrialListtProps {
  initialTrials: TrialListtOutput;
  session: Session | null;
}
export default function TrialList({ initialTrials, session }: TrialListtProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.trials.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialTrials], pageParams: [undefined] },
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
        <h1 className="p-4 text-xl font-bold">Error fetching trials</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" key={i}>
              {page.trials.map((trial, index) => (
                <div key={trial.id} ref={index === page.trials.length - 1 ? ref : undefined}>
                  <TrialCard trial={trial} session={session} />
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