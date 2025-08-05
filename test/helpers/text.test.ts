import { timeRead } from '@/helpers/text';
import { expect, describe, it } from 'vitest';

describe('timeRead', () => {
	it('возвращает 1 минуту для короткого текста', () => {
		expect(timeRead('Hello, world!')).toBe(1);
	});

	it('корректно рассчитывает время чтения для большого текста', () => {
		const longText = 'слово '.repeat(999); // 800 слов
		expect(timeRead(longText)).toBe(5); // 800 / 200 = 4 минуты
	});
});
