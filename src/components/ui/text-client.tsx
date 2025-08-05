'use client';

import React from 'react';
import { useDictionaryStore } from '@/stores/lang/langStore';
import { Dictionary, Lang } from '@/types/i18n';
import { Leaves } from '@/types/utils';
import { getFromDict } from '@/helpers/i18n-client';

type Text = Leaves<Dictionary>;

type TextProps<T> = {
	text: Leaves<T>;
	lang?: Lang;
	dict?: Record<string, any>;
};

export const Text = <T = Dictionary,>({ text, dict }: TextProps<T>) => {
	let d: any = useDictionaryStore(state => state.dictionary);
	if (dict) {
		d = dict;
	}
	const value = getFromDict(d, text);

	return <>{value}</>;
};
