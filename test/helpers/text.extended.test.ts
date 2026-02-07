import { describe, it, expect } from 'vitest';
import { timeRead, getReadingTimeText } from '@/helpers/text';

describe('timeRead', () => {
	it('calculates reading time correctly', () => {
		// 200 words per minute is the standard
		const shortText = 'word '.repeat(100);
		const result = timeRead(shortText);
		expect(result).toEqual({ hours: 0, minutes: 1 }); // 100 words = 1 min
	});

	it('returns 1 minute for short texts', () => {
		const result = timeRead('Short text');
		expect(result.minutes).toBeGreaterThanOrEqual(1);
		expect(result.hours).toBe(0);
	});

	it('handles empty text', () => {
		const result = timeRead('');
		expect(result).toEqual({ hours: 0, minutes: 1 }); // At least 1 minute
	});

	it('handles long texts', () => {
		const longText = 'word '.repeat(1000);
		const result = timeRead(longText);
		expect(result.minutes).toBeGreaterThan(0);
	});

	it('calculates hours for very long texts', () => {
		const veryLongText = 'word '.repeat(15000); // 15000 words = 75 min = 1h 15min
		const result = timeRead(veryLongText);
		expect(result.hours).toBeGreaterThanOrEqual(1);
	});
});

describe('getReadingTimeText', () => {
	describe('Russian', () => {
		it('returns correct singular minute', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 1 }, 'ru');
			expect(result).toBe('1 минута');
		});

		it('returns correct plural minutes (few)', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 2 }, 'ru');
			expect(result).toBe('2 минуты');
		});

		it('returns correct plural minutes (many)', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 5 }, 'ru');
			expect(result).toBe('5 минут');
		});

		it('returns hours and minutes', () => {
			const result = getReadingTimeText({ hours: 1, minutes: 30 }, 'ru');
			expect(result).toBe('1 час 30 минут');
		});

		it('handles zero minutes', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 0 }, 'ru');
			expect(result).toBe('0 минут');
		});
	});

	describe('English', () => {
		it('returns correct singular minute', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 1 }, 'en');
			expect(result).toBe('1 min');
		});

		it('returns correct plural minutes', () => {
			const result = getReadingTimeText({ hours: 0, minutes: 5 }, 'en');
			expect(result).toBe('5 mins');
		});

		it('returns hours and minutes', () => {
			const result = getReadingTimeText({ hours: 1, minutes: 30 }, 'en');
			expect(result).toBe('1 hour 30 mins');
		});

		it('returns plural hours', () => {
			const result = getReadingTimeText({ hours: 2, minutes: 0 }, 'en');
			expect(result).toBe('2 hours'); // When minutes is 0 but hours > 0, only hours shown
		});
	});
});
