'use client';

import { ReactNode, useEffect } from 'react';
import { Dictionary, Lang } from '@/types/i18n';
import { useDictionaryStore } from './langStore';

type Props = {
	children: ReactNode;
	dict: Dictionary;
	lang: Lang;
};

export const DictionaryProvider = ({ children, dict, lang }: Props) => {
	const setDictionary = useDictionaryStore(state => state.setDictionary);
	const setLang = useDictionaryStore(state => state.setLang);

	useEffect(() => {
		setDictionary(dict);
		setLang(lang);
	}, [dict, lang, setDictionary, setLang]);

	return <>{children}</>;
};
