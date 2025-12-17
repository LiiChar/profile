

export const timeRead = (text: string): { hours: number; minutes: number } => {
	const totalMinutes = Math.ceil(text.split(' ').length / 200);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return { hours, minutes };
};

export const getReadingTimeText = (time: { hours: number; minutes: number }, lang: 'en' | 'ru'): string => {
	if (lang === 'ru') {
		const parts: string[] = [];

		if (time.hours > 0) {
			const hourWord = getRussianPlural(time.hours, 'час', 'часа', 'часов');
			parts.push(`${time.hours} ${hourWord}`);
		}

		if (time.minutes > 0 || time.hours === 0) {
			const minuteWord = getRussianPlural(time.minutes, 'минута', 'минуты', 'минут');
			parts.push(`${time.minutes} ${minuteWord}`);
		}

		return parts.join(' ');
	} else {
		// English
		const parts: string[] = [];

		if (time.hours > 0) {
			const hourWord = time.hours === 1 ? 'hour' : 'hours';
			parts.push(`${time.hours} ${hourWord}`);
		}

		if (time.minutes > 0 || time.hours === 0) {
			const minuteWord = time.minutes === 1 ? 'min' : 'mins';
			parts.push(`${time.minutes} ${minuteWord}`);
		}

		return parts.join(' ');
	}
};

const getRussianPlural = (n: number, one: string, few: string, many: string): string => {
	const mod10 = n % 10;
	const mod100 = n % 100;

	if (mod100 >= 11 && mod100 <= 19) {
		return many;
	} else if (mod10 === 1) {
		return one;
	} else if (mod10 >= 2 && mod10 <= 4) {
		return few;
	} else {
		return many;
	}
};
