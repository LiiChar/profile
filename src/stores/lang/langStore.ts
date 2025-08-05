// stores/useDictionaryStore.ts
import { Dictionary } from '@/types/i18n';
import { create } from 'zustand';

type DictionaryStore = {
	dictionary: Dictionary | null;
	setDictionary: (dict: Dictionary) => void;
};

export const useDictionaryStore = create<DictionaryStore>(set => ({
	dictionary: null,
	setDictionary: dict => set({ dictionary: dict }),
}));
