'use client';

import { getFieldLang } from "@/helpers/i18n-client";
import { useDictionaryStore } from "@/stores/lang/langStore";
import { EntityLangField, FieldLangs } from "@/types/i18n";
import { memo } from "react";

type ContentProps = {
	data: EntityLangField & { lang?: FieldLangs };
	field: keyof EntityLangField;
};

const Content = memo(({ data, field }: ContentProps) => {
  const lang = useDictionaryStore(state => state.lang);

	return (
		<>
			{getFieldLang(data, field, lang ?? 'ru')}
		</>
	);
});

Content.displayName = 'Content';

export { Content };
