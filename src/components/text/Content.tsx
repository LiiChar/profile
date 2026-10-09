'use client';

import { getFieldLang } from "@/helpers/i18n-client";
import { useDictionary } from "@/stores/lang/langProvider";
import { EntityLangField, FieldLangs } from "@/types/i18n";
import { memo } from "react";

type ContentProps = {
	data: EntityLangField & { lang?: FieldLangs };
	field: keyof EntityLangField;
};

const Content = memo(({ data, field }: ContentProps) => {
	  const { lang } = useDictionary();

	return (
		<>
			{getFieldLang(data, field, lang)}
		</>
	);
});

Content.displayName = 'Content';

export { Content };
