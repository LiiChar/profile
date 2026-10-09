'use client';

import { getDate } from "@/helpers/date";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/stores/lang/langProvider";

type DateProps = {
	date: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Date = ({ date, ...attr }: DateProps) => {
  const { lang } = useDictionary();
	return (
		<div {...attr} className={cn('text-nowrap text-sm', attr.className)}>
			{getDate(date, lang)}
		</div>
	);
};
