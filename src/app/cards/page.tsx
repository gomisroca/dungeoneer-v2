import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import CardList from './CardList';

export default async function CardListWrapper() {
  const initialCards = await api.cards.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <CardList session={session} initialCards={initialCards} />;
}
