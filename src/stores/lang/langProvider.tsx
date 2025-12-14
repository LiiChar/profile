'use client';

import { ReactNode, useEffect } from 'react';
import { Dictionary } from '@/types/i18n';
import { useDictionaryStore } from './langStore';

type Props = {
	children: ReactNode;
	dict: Dictionary;
};

export const DictionaryProvider = ({ children, dict }: Props) => {
	const setDictionary = useDictionaryStore(state => state.setDictionary);
	
	useEffect(() => {
		setDictionary(dict);
	}, [dict, setDictionary]);

	return <>{children}</>;
};
