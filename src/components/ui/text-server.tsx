'use server';

import {
	defaultLocale,
	getDictionary,
	getFromDict,
} from '@/dictionaries/dictionaries';
import { Dictionary, Lang } from '@/types/i18n';
import { Leaves } from '@/types/utils';
import { headers } from 'next/headers';

type Text = Leaves<Dictionary>;

type TextProps = {
	text: Text;
};

export const Text = async ({ text }: TextProps) => {
	const headerList = await headers();
	const lang = headerList.get('x-current-language');

	const dict = await getDictionary((lang ?? defaultLocale) as Lang);
	const value = getFromDict(dict, text);

	return <>{value}</>;
};
