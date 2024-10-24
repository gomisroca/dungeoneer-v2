import { api } from '@/trpc/react';
import { type ExpandedCard } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useCardLogic(card: ExpandedCard) {
  const utils = api.useUtils();

  const addToUserMutation = api.cards.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${card.name} to your collection.`);
      await utils.cards.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ cardId: card.id });
  };

  const removeFromUserMutation = api.cards.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${card.name} from your collection.`);
      await utils.cards.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ cardId: card.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
