import { timeRead } from '@/helpers/text';
import { expect, describe, it } from 'vitest';

describe('timeRead', () => {
	it('возвращает 1 минуту для короткого текста', () => {
		const result = timeRead('Hello, world!');
		expect(result).toEqual({ hours: 0, minutes: 1 });
	});

	it('корректно рассчитывает время чтения для большого текста', () => {
		const longText = 'слово '.repeat(999); // 999 слов
		const result = timeRead(longText);
		expect(result).toEqual({ hours: 0, minutes: 5 }); // 999 / 200 = ~5 минут
	});
});
