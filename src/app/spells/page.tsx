import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import SpellList from './SpellList';

export default async function MinionListWrapper() {
  const initialSpells = await api.spells.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <SpellList session={session} initialSpells={initialSpells} />;
}
