import { getServerAuthSession } from '@/server/auth';
import OrchestrionList from './OrchestrionList';
import { api } from '@/trpc/server';

export default async function OrchestrionListWrapper() {
  const initialOrchestrions = await api.orchestrions.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <OrchestrionList session={session} initialOrchestrions={initialOrchestrions} />;
}
