export const timeRead = (text: string): number =>
	Math.ceil(text.split(' ').length / 200);
