import { locales } from '@/const/i18n';
import { BlogLangField } from '@/db/tables/blog';
import { ProjectLangField } from '@/db/tables/project';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Leaves } from '@/types/utils';

export type Lang = (typeof locales)[number];
export type DictionaryLang = { lang: Lang };
export type LangParams = { params: Promise<{ lang: string }> };
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
export type TextDict = Leaves<Dictionary>;
export type EntityLangField = BlogLangField & ProjectLangField;
export type FieldLangs = Record<'en', Partial<EntityLangField>> | null;
