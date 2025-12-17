'use client';

import { getDate } from "@/helpers/date";
import { cn } from "@/lib/utils";
import { useDictionaryStore } from "@/stores/lang/langStore";

type DateProps = {
	date: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Date = ({ date, ...attr }: DateProps) => {
  const lang = useDictionaryStore(state => state.lang) ?? 'en';
	return (
		<div {...attr} className={cn('text-nowrap text-sm', attr.className)}>
			{getDate(date, lang)}
		</div>
	);
};