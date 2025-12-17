'use client';

import { getFieldLang } from "@/helpers/i18n-client";
import { useDictionaryStore } from "@/stores/lang/langStore";
import { EntityLangField, FieldLangs } from "@/types/i18n";
import { memo } from "react";
import { Markdown } from "../ui/markdown";

type ContentProps = {
	data: EntityLangField & { lang?: FieldLangs };
	field: keyof EntityLangField;
};

const ContentMarkdown = memo(({ data, field }: ContentProps) => {
  const lang = useDictionaryStore(state => state.lang);

	return (
		<Markdown >
			{getFieldLang(data, field, lang ?? 'ru')}
		</Markdown>
	);
});

ContentMarkdown.displayName = 'ContentMarkdown';

export { ContentMarkdown };
