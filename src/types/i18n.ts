import { locales } from '@/const/i18n';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Leaves } from '@/types/utils';

export type Lang = (typeof locales)[number];
export type DictionaryLang = { lang: Lang };
export type LangParams = { params: Promise<DictionaryLang> };
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
export type TextDict = Leaves<Dictionary>;
