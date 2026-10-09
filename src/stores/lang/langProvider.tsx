'use client';

import { createContext, ReactNode, useContext } from 'react';
import { Dictionary, Lang } from '@/types/i18n';

type DictionaryValue = {
	dict: Dictionary;
	lang: Lang;
};

type Props = DictionaryValue & { children: ReactNode };

export const DictionaryContext = createContext<DictionaryValue | null>(null);

export const DictionaryProvider = ({ children, dict, lang }: Props) => (
	<DictionaryContext.Provider value={{ dict, lang }}>
		{children}
	</DictionaryContext.Provider>
);

export const useDictionary = () => {
	const value = useContext(DictionaryContext);
	if (!value) throw new Error('useDictionary must be used inside DictionaryProvider');
	return value;
};
