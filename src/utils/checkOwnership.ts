import { type Session } from 'next-auth';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial } from 'types';

export default function checkOwnership(
  instance: ExpandedDungeon | ExpandedRaid | ExpandedTrial,
  session: Session | null
) {
  const allMinionsOwned = instance.minions.every((minion) => minion.owners.some((m) => m.id === session?.user.id));
  const allMountsOwned = instance.mounts.every((mount) => mount.owners.some((m) => m.id === session?.user.id));
  const allOrchsOwned = instance.orchestrions.every((orch) => orch.owners.some((o) => o.id === session?.user.id));
  const allSpellsOwned = instance.spells.every((spell) => spell.owners.some((o) => o.id === session?.user.id));
  const allCardsOwned = instance.cards.every((card) => card.owners.some((o) => o.id === session?.user.id));

  const allOwned = allMinionsOwned && allMountsOwned && allOrchsOwned && allSpellsOwned && allCardsOwned;

  return allOwned;
}
