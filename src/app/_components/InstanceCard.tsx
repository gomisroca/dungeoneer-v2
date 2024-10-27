import checkOwnership from '@/utils/checkOwnership';
import { type Session } from 'next-auth';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';
import ItemSelector from './ItemSelector';

export default function InstanceCard({
  instance,
  session,
}: {
  instance: ExpandedDungeon | ExpandedTrial | ExpandedRaid | ExpandedVariantDungeon;
  session: Session | null;
}) {
  const allOwned = checkOwnership(instance, session);
  // subtitles has to be an array
  const [title, ...subtitles] = instance.name.split(/[-:(]/);

  return (
    <div
      className={twMerge(
        'relative flex h-full flex-col items-center justify-start gap-y-4 rounded-xl border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        allOwned && 'opacity-50 hover:opacity-100'
      )}>
      {allOwned && (
        <div className="absolute right-[-25px] top-[-25px] flex contrast-200">
          <span className="m-auto text-8xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      {instance.image && (
        <Image
          src={instance.image}
          alt={instance.name}
          width={300}
          height={100}
          className="w-full object-cover"
          unoptimized
        />
      )}
      <div className="flex flex-col items-center justify-center gap-1">
        {title && <h1 className="line-clamp-2 text-center text-lg">{title[0]!.toUpperCase() + title.slice(1)}</h1>}

        {subtitles && (
          <div className="flex flex-row items-center justify-center gap-1">
            {subtitles.map((sub, i) => (
              <p key={i} className="text-center">
                {sub.split(')')[0]}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        {instance.minions.length > 0 && <ItemSelector items={instance.minions} type="minions" session={session} />}
        {instance.mounts.length > 0 && <ItemSelector items={instance.mounts} type="mounts" session={session} />}
        {instance.orchestrions.length > 0 && (
          <ItemSelector items={instance.orchestrions} type="orchestrions" session={session} />
        )}
        {instance.spells.length > 0 && <ItemSelector items={instance.spells} type="spells" session={session} />}
        {instance.cards.length > 0 && <ItemSelector items={instance.cards} type="cards" session={session} />}
        {instance.emotes.length > 0 && <ItemSelector items={instance.emotes} type="emotes" session={session} />}
        {instance.hairstyles.length > 0 && (
          <ItemSelector items={instance.hairstyles} type="hairstyles" session={session} />
        )}
      </div>
    </div>
  );
}
