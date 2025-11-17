'use client';

import { useEffect, useState, useCallback } from 'react';

export function usePuterAI() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Если скрипт уже успел загрузиться
		if (window.puter) {
			setLoaded(true);
			return;
		}

		// Если HTMLScriptElement ещё загружается, ждём появления window.puter
		const interval = setInterval(() => {
			if (window.puter) {
				setLoaded(true);
				clearInterval(interval);
			}
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const chat = useCallback(async (prompt: string) => {
		if (!window.puter) throw new Error('Puter API not loaded yet');
		console.log(window.puter);
		
		return await window.puter.ai.chat(prompt);
	}, []);

	return { loaded, chat };
}
