import { BlogLangField, BlogType } from '@/db/tables/blog';
import { defaultLocale } from '@/dictionaries/dictionaries';
import { Lang } from '@/types/i18n';
import { headers } from 'next/headers';

export const updateLanugagePath = (
	lang: 'en' | 'ru',
	currentPath: string
): string => {
	const segments = currentPath.split('/');
	segments[1] = lang; // меняем локаль
	const newPath = segments.join('/');
	return newPath; // серверный редирект
};

export const getFromDict = (dict: any, path: string): any => {
	const parts = path.split('.');

	let current: any = dict;

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];

		// Ключ с индексом в квадратных скобках, например items[0]
		const matchBracketIndex = part.match(/^(\w+)\[(\d+)\]$/);
		if (matchBracketIndex) {
			const [, arrayKey, indexStr] = matchBracketIndex;
			const index = parseInt(indexStr, 10);
			current = current?.[arrayKey]?.[index];
			continue;
		}

		// Ключ с пустым индексом — массив всех элементов, например items[]
		const matchBracketArray = part.match(/^(\w+)\[\]$/);
		if (matchBracketArray) {
			const [, arrayKey] = matchBracketArray;
			const restPath = parts.slice(i + 1).join('.');
			const arr = current?.[arrayKey];
			if (!Array.isArray(arr)) return undefined;
			return arr.map((item: any) => getFromDict(item, restPath));
		}

		// Числовой индекс как отдельный ключ, например items.0
		if (/^\d+$/.test(part)) {
			if (!Array.isArray(current)) return undefined;
			current = current[Number(part)];
			continue;
		}

		// Обычный ключ
		current = current?.[part];
		if (current === undefined) return undefined;
	}

	return current;
};

export const getLang = async () => {
	const headerList = await headers();
	const lang = (headerList.get('x-current-language') || defaultLocale) as Lang;
	return lang;
};

export const getBlogLang = (
	blog: BlogType,
	field: keyof BlogLangField,
	lang: Lang = 'en'
) => {
	const blogField = blog[field]!;

	if (lang == 'ru') {
		return blogField;
	}
	if (!blog['lang']) {
		return blogField;
	}
	if (!blog['lang'][lang][field]) {
		return blogField;
	}

	return blog['lang'][lang][field];
};
