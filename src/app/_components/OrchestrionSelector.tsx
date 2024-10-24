'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedOrchestrion } from 'types';
import Button from './ui/Button';
import { twMerge } from 'tailwind-merge';
import { useOrchestrionLogic } from '@/hooks/useOrchestrionLogic';
import { FaLock } from 'react-icons/fa6';

function OrchestrionView({ orchestrion, session }: { orchestrion: ExpandedOrchestrion; session: Session | null }) {
  const { addToUser, removeFromUser } = useOrchestrionLogic(orchestrion);
  const isOwnedByUser = orchestrion.owners.some((o) => o.id === session?.user.id);

  return (
    <Button onClick={isOwnedByUser ? removeFromUser : addToUser} disabled={!session} className="p-0">
      <div className="relative flex-shrink-0">
        {orchestrion.image && (
          <Image
            src={orchestrion.image}
            alt={orchestrion.name}
            width={50}
            height={50}
            unoptimized
            className={twMerge('flex-shrink-0 rounded-xl', isOwnedByUser && 'opacity-75')} // Prevents the image from shrinking
          />
        )}
        {isOwnedByUser && (
          <div className="absolute bottom-0 left-0 right-0 top-0 flex">
            <span className="m-auto text-4xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-start">
        <p
          className={twMerge(
            'max-w-full flex-shrink overflow-hidden text-ellipsis',
            isOwnedByUser && 'text-stone-500'
          )}>
          {orchestrion.name}
        </p>
        {!session && (
          <div className="flex items-center justify-center gap-2">
            <FaLock className="text-stone-400 dark:text-stone-600" />
            <p className="m-auto text-sm text-stone-400 dark:text-stone-600">Log in to add to your collection.</p>
          </div>
        )}
      </div>
    </Button>
  );
}

function OrchestrionSelector({
  orchestrions,
  session,
}: {
  orchestrions: ExpandedOrchestrion[];
  session: Session | null;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {orchestrions.map((orchestrion) => (
        <OrchestrionView key={orchestrion.id} orchestrion={orchestrion} session={session} />
      ))}
    </div>
  );
}

export default OrchestrionSelector;
