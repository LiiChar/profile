import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
	getYear,
	getMonth,
	getCurrentDateAtMinute,
	getDate,
	getFormattedDate,
} from '@/helpers/date'; // путь поправь под себя

const normalize = (str: string) => str.replace(/\u202F/g, ' ');

describe('getYear', () => {
	it('возвращает год из строки даты', () => {
		expect(getYear('2024-07-20')).toBe(2024);
	});
});

describe('getMonth', () => {
	it('возвращает месяц из строки даты', () => {
		expect(getMonth('2024-03-15')).toBe(2); // март -> 2, т.к. месяцы с 0
	});

	it('возвращает текущий месяц, если аргумент не передан', () => {
		const now = new Date('2024-11-01T12:00:00Z');
		vi.setSystemTime(now);
		expect(getMonth()).toBe(now.getMonth());
	});
});

describe('getCurrentDateAtMinute', () => {
	beforeAll(() => {
		// Задаём фиксированную дату
		vi.setSystemTime(new Date('2024-11-14T16:23:50'));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('возвращает корректную дату с вычетом минут', () => {
		const result = getCurrentDateAtMinute(10);
		expect(result).toBe('2024-11-14 16:13:50');
	});
});

describe('getDate', () => {
	it('возвращает форматированную дату в ru-RU формате', () => {
		expect(normalize(getDate('2024-07-20', 'ru'))).toBe('20 июля 2024 г.');
	});

	it('возвращает форматированную дату в en-US формате', () => {
		expect(normalize(getDate('2024-07-20', 'en'))).toBe('July 20, 2024');
	});

	it('по умолчанию возвращает en-US формат', () => {
		expect(normalize(getDate('2024-07-20'))).toBe('July 20, 2024');
	});
});

describe('getFormattedDate', () => {
	const testDate = new Date('2024-07-20T09:05:07');

	it('форматирует дату по шаблону d.m.y h:i:s a', () => {
		const result = getFormattedDate('d.m.y h:i:s a', testDate);
		expect(result).toBe('20.07.2024 09:05:07 AM');
	});

	it('форматирует дату по шаблону y/m/d', () => {
		const result = getFormattedDate('y/m/d', testDate);
		expect(result).toBe('2024/07/20');
	});
});
