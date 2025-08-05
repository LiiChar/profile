import { updateLanugagePath, getFromDict } from '@/helpers/i18n';
import { expect, describe, it } from 'vitest';

describe('updateLanugagePath', () => {
	it('заменяет язык в URL', () => {
		expect(updateLanugagePath('en', '/ru/projects')).toBe('/en/projects');
	});
});

const mockDict = {
	home: {
		title: 'Главная',
		subtitle: 'Добро пожаловать',
	},
	items: [
		{ name: 'Первый', price: 100 },
		{ name: 'Второй', price: 200 },
	],
	nested: {
		list: [
			{ key: 'A', value: 1 },
			{ key: 'B', value: 2 },
		],
	},
};

describe('getFromDict', () => {
	it('достаёт значение по обычному пути', () => {
		expect(getFromDict(mockDict, 'home.title')).toBe('Главная');
		expect(getFromDict(mockDict, 'home.subtitle')).toBe('Добро пожаловать');
	});

	it('достаёт значение из массива по индексу в скобках', () => {
		expect(getFromDict(mockDict, 'items[0].name')).toBe('Первый');
		expect(getFromDict(mockDict, 'items[1].price')).toBe(200);
	});

	it('достаёт массив значений по items[].key', () => {
		expect(getFromDict(mockDict, 'nested.list[].key')).toEqual(['A', 'B']);
	});

	it('достаёт элемент по числовому индексу как ключу', () => {
		expect(getFromDict(mockDict, 'items.1.name')).toBe('Второй');
	});

	it('возвращает undefined для несуществующих путей', () => {
		expect(getFromDict(mockDict, 'home.unknown')).toBeUndefined();
		expect(getFromDict(mockDict, 'items[10].name')).toBeUndefined();
		expect(getFromDict(mockDict, 'nested.list[].missing')).toEqual([
			undefined,
			undefined,
		]);
	});
});
