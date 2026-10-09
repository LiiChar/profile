'use client';

import React from 'react';
import { useDictionary } from '@/stores/lang/langProvider';
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
	const { dict: providerDict } = useDictionary();
	const value = getFromDict(dict ?? providerDict, text);

	return <>{value}</>;
};
