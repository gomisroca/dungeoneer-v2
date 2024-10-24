'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import MountCard from './MountCard';

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

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching mounts</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5" key={i}>
              {page.mounts.map((mount, index) => (
                <div key={mount.id} ref={index === page.mounts.length - 1 ? ref : undefined}>
                  <MountCard mount={mount} session={session} />
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-orange-300 p-4 text-center text-xl font-bold dark:bg-orange-700">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
