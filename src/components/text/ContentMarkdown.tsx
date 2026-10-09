'use client';

import { getFieldLang } from "@/helpers/i18n-client";
import { useDictionary } from "@/stores/lang/langProvider";
import { EntityLangField, FieldLangs } from "@/types/i18n";
import { memo } from "react";
import { Markdown } from "../ui/markdown";

type ContentProps = {
	data: EntityLangField & { lang?: FieldLangs };
	field: keyof EntityLangField;
};

const ContentMarkdown = memo(({ data, field }: ContentProps) => {
	  const { lang } = useDictionary();

	return (
		<Markdown >
			{getFieldLang(data, field, lang)}
		</Markdown>
	);
});

ContentMarkdown.displayName = 'ContentMarkdown';

export { ContentMarkdown };
