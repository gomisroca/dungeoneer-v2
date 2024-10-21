import { getServerAuthSession } from '@/server/auth';
import MinionList from './MinionList';
import { api } from '@/trpc/server';

export default async function MinionListWrapper() {
  const initialMinions = await api.minions.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return <MinionList session={session} initialMinions={initialMinions} />;
}
