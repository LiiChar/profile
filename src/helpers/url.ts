import { BASE_URL } from '@/const/url';

export const getUrl = (url: string): string => {
	if (url && (url.includes('http') || url.includes('https'))) {
		return url;
	}
	if (url.startsWith('data:')) {
		return url;
	}
	return joinUrl(BASE_URL, url);
};

export function joinUrl(...parts: string[]): string {
	return parts
		.map((part, index) => {
			// Заменяем обратные слэши на прямые и убираем лишние
			const cleaned = part
				.replace(/\\/g, '/') // \ → /
				.replace(/\/{2,}/g, '/') // // → /
				.replace(/^\/+|\/+$/g, ''); // обрезаем слэши с краёв

			// Первую часть (если это baseURL с http) не трогаем в начале
			if (index === 0 && /^https?:\/\//.test(part)) {
				return part.replace(/\/+$/, '');
			}

			return cleaned;
		})
		.filter(Boolean)
		.join('/');
}
