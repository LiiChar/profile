
export const getUrl = (url: string): string => {
	if (url && (url.includes('http') || url.includes('https'))) {
		return url;
	}
	if (url.startsWith('data:')) {
		return url;
	}
	return url;
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

export const validateUrl = (url: string | undefined | null): boolean => {
	if (!url) return false;
	return url.startsWith('http://') || url.startsWith('https://');
};

export function normalizeImageUrl(url?: string | null) {
  if (!url) return '/images/placeholder.png';

  try {
    const parsed = new URL(url, 'http://localhost');

    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1'
    ) {
      return `${parsed.pathname}${parsed.search}`;
    }

    return url;
  } catch {
    return url;
  }
}
