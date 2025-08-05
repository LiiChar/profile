import { getUrl, joinUrl } from './../../src/helpers/url';
import { expect, describe, it } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('getUrl', () => {
	it('возвращает абсолютный путь, если передан относительный', () => {
		expect(getUrl('/test')).toBe(BASE_URL + '/test');
	});

	it('возвращает абсолютный путь без изменений, если он уже абсолютный', () => {
		expect(getUrl(BASE_URL + '/test')).toBe(BASE_URL + '/test');
	});

	it('возвращает data-ссылку без изменений', () => {
		expect(getUrl('data:test')).toBe('data:test');
	});
});

describe('joinUrl', () => {
	it('объединяет базовый и относительный путь', () => {
		expect(joinUrl(BASE_URL, '/test')).toBe(BASE_URL + '/test');
	});
});
