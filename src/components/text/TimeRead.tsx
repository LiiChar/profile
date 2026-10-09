'use client';

import { getReadingTimeText, timeRead } from "@/helpers/text";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/stores/lang/langProvider";
import { memo } from "react";

type TimeReadProps = {
	content: string;
} & React.HTMLAttributes<HTMLDivElement>;

const TimeRead = memo(({ content, ...attr }: TimeReadProps) => {
  const { lang } = useDictionary();

	  const readingTimeText = getReadingTimeText(timeRead(content), lang);

	return (
		<div {...attr} className={cn('text-nowrap text-sm', attr.className)}>
			{readingTimeText}
		</div>
	);
});

TimeRead.displayName = 'TimeRead';

export { TimeRead };
