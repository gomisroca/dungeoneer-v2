'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';
import { useItemFilter } from '@/hooks/useItemFilter';
import Filter from '@/app/_components/Filter';

type MountListOutput = RouterOutputs['mounts']['getAll'];
interface MountListProps {
  session: Session | null;
  initialMounts: MountListOutput;
}
export default function MountList({ session, initialMounts }: MountListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.mounts.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialMounts], pageParams: [undefined] },
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

  const allMounts = data?.pages.flatMap((page) => page.mounts) ?? [];

  const [filter, setFilter] = useState<boolean>(false);
  const filteredMounts = useItemFilter(allMounts, filter, session);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching mounts</h1>
      ) : (
        <>
          <Filter onFilterChange={setFilter} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredMounts.map((mount, index) => (
              <div key={mount.id} ref={index === filteredMounts.length - 1 ? ref : undefined}>
                <ItemCard item={mount} type="mounts" session={session} />
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-cyan-300 p-4 text-center text-base font-bold dark:bg-cyan-700 md:text-xl">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
