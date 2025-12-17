// stores/useDictionaryStore.ts
import { Dictionary, Lang } from '@/types/i18n';
import { create } from 'zustand';

type DictionaryStore = {
	dictionary: Dictionary | null;
	lang: Lang | null;
	setDictionary: (dict: Dictionary) => void;
	setLang: (lang: Lang) => void;
};

export const useDictionaryStore = create<DictionaryStore>(set => ({
	dictionary: null,
	lang: null,
	setDictionary: dict => set({ dictionary: dict }),
	setLang: lang => set({ lang }),
}));
