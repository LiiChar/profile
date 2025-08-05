import { Lang } from '@/types/i18n';

export const dictionaries = {
	en: () => import('./en.json').then(module => module.default),
	ru: () => import('./ru.json').then(module => module.default),
};

export const getDictionary = async (locale: Lang) => dictionaries[locale]();

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

export const defaultLocale = 'en';
