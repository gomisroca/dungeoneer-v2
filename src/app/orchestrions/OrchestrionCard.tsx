'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '@/app/_components/ui/Button';
import { type ExpandedOrchestrion } from 'types';
import Source from '../_components/ui/Source';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';
import { useOrchestrionLogic } from '@/hooks/useOrchestrionLogic';

function AddOrRemoveButton({
  orchestrion,
  isOwnedByUser,
  session,
}: {
  orchestrion: ExpandedOrchestrion;
  isOwnedByUser: boolean;
  session: Session | null;
}) {
  const { addToUser, removeFromUser } = useOrchestrionLogic(orchestrion);

  return isOwnedByUser ? (
    <div className="flex flex-col items-start justify-start">
      <Button
        name="Remove from Collection"
        className="w-full"
        type="submit"
        onClick={removeFromUser}
        disabled={!session}>
        Remove
      </Button>
      {!session && (
        <div className="flex items-center justify-center gap-2">
          <FaLock className="text-stone-400 dark:text-stone-600" />
          <p className="m-auto text-sm text-stone-400 dark:text-stone-600">Log in to add to your collection.</p>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-start justify-start">
      <Button name="Add to Collection" className="w-full" type="submit" onClick={addToUser} disabled={!session}>
        Add
      </Button>
      {!session && (
        <div className="flex items-center justify-center gap-2 text-center">
          <FaLock className="text-stone-400 dark:text-stone-600" />
          <p className="m-auto text-sm text-stone-400 dark:text-stone-600">Log in to add to your collection.</p>
        </div>
      )}
    </div>
  );
}

export default function OrchestrionCard({
  orchestrion,
  session,
}: {
  orchestrion: ExpandedOrchestrion;
  session: Session | null;
}) {
  const isOwnedByUser = orchestrion.owners.some((o) => o.id === session?.user.id);

  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700',
        isOwnedByUser && 'opacity-50 hover:opacity-100'
      )}>
      {isOwnedByUser && (
        <div className="absolute right-[-25px] top-[-25px] flex contrast-200">
          <span className="m-auto text-8xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      {orchestrion.image && (
        <Image src={orchestrion.image} alt={orchestrion.name} width={100} height={100} className="rounded-xl" />
      )}
      <h1 className="line-clamp-2 text-center text-xl">{orchestrion.name}</h1>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
        {orchestrion.sources.map((source) => (
          <Source key={source.id} source={source} />
        ))}
      </div>
      <AddOrRemoveButton orchestrion={orchestrion} isOwnedByUser={isOwnedByUser} session={session} />
    </div>
  );
}
