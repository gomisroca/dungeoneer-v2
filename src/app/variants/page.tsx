import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import VariantDungeonList from './VariantDungeonList';

export default async function VariantDungeonListWrapper() {
  const initialDungeons = await api.variants.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return <VariantDungeonList session={session} initialDungeons={initialDungeons} />;
}
