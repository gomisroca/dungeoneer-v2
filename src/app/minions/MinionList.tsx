'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '@/app/_components/ui/Button';
import { type ExpandedMinion } from 'types';
import { signal, useSignalEffect } from '@preact-signals/safe-react';
import Source from '../_components/ui/Source';
import { addMessage } from '../_components/ui/MessagePopup';

const minionsInLS = signal<string[]>([]);

function AddOrRemoveButton({
  minion,
  isOwnedByUser,
  session,
}: {
  minion: ExpandedMinion;
  isOwnedByUser: boolean;
  session: Session | null;
}) {
  const utils = api.useUtils();

  const addToUserMutatiom = api.minions.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${minion.name} to your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutatiom.mutate({ minionId: minion.id });
  };

  const addToLS = () => {
    const lsMinions = localStorage.getItem('dungeoneer_minions');
    if (!lsMinions) {
      localStorage.setItem('dungeoneer_minions', JSON.stringify([minion.id]));
    } else {
      const parsedLsMinions: string[] = JSON.parse(lsMinions) as string[];
      parsedLsMinions.push(minion.id);
      localStorage.setItem('dungeoneer_minions', JSON.stringify(parsedLsMinions));
      minionsInLS.value = parsedLsMinions;
      addMessage(`Added ${minion.name} to your collection.`);
      addMessage(`Log in to make sure you never lose your collection.`);
    }
  };

  const removeFromUserMutatiom = api.minions.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${minion.name} from your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutatiom.mutate({ minionId: minion.id });
  };

  const removeFromLS = () => {
    const lsMinions = localStorage.getItem('dungeoneer_minions');
    if (lsMinions) {
      const parsedLsMinions = JSON.parse(lsMinions) as string[];
      const updatedMinions = parsedLsMinions.filter((id: string) => id !== minion.id);
      localStorage.setItem('dungeoneer_minions', JSON.stringify(updatedMinions));
      minionsInLS.value = updatedMinions;
      addMessage(`Removed ${minion.name} from your collection.`);
    }
  };

  return isOwnedByUser ? (
    <Button
      name="Remove from Collection"
      className="w-full"
      type="submit"
      onClick={session ? removeFromUser : removeFromLS}>
      Remove from Collection
    </Button>
  ) : (
    <Button name="Add to Collection" className="w-full" type="submit" onClick={session ? addToUser : addToLS}>
      Add to Collection
    </Button>
  );
}

function MinionCard({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const isOwnedByUser = session?.user
    ? minion.owners.some((o) => o.id === session.user.id)
    : minionsInLS.value.includes(minion.id);

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-200/20 p-4 font-semibold transition duration-200 ease-in-out hover:scale-110 hover:bg-stone-200/40 dark:border-stone-800 dark:bg-stone-800/20 hover:dark:bg-stone-800/40">
      {minion.image && <Image src={minion.image} alt={minion.name} width={100} height={100} />}
      <h1 className="line-clamp-2 text-center text-xl">{minion.name}</h1>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
        {minion.sources.map((source) => (
          <Source key={source.id} source={source} />
        ))}
      </div>
      <AddOrRemoveButton minion={minion} isOwnedByUser={isOwnedByUser} session={session} />
    </div>
  );
}

type MinionListOutput = RouterOutputs['minions']['getAll'];
interface MinionListProps {
  session: Session | null;
  initialMinions: MinionListOutput;
}
export default function MinionList({ session, initialMinions }: MinionListProps) {
  useSignalEffect(() => {
    const lsMinions = localStorage.getItem('dungeoneer_minions');
    if (lsMinions) {
      minionsInLS.value = JSON.parse(lsMinions) as string[];
    }
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.minions.getAll.useInfiniteQuery(
    {
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialMinions], pageParams: [undefined] },
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
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5" key={i}>
              {page.minions.map((minion, index) => (
                <div key={minion.id} ref={index === page.minions.length - 1 ? ref : undefined}>
                  <MinionCard minion={minion} session={session} />
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
