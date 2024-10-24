import { api } from '@/trpc/react';
import { type ExpandedSpell } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useSpellLogic(spell: ExpandedSpell) {
  const utils = api.useUtils();

  const addToUserMutation = api.spells.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${spell.name} to your collection.`);
      await utils.spells.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ spellId: spell.id });
  };

  const removeFromUserMutation = api.spells.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${spell.name} from your collection.`);
      await utils.spells.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ spellId: spell.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
