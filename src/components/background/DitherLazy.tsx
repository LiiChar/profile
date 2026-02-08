'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Dither = dynamic(() => import('./Dither.js').then((mod) => mod.default), {
	ssr: false,
});

const shouldEnableDither = () => {
	if (typeof window === 'undefined') return false;
	const isMobile = window.innerWidth < 768;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
		.matches;
	const isLowEndDevice =
		typeof navigator.hardwareConcurrency === 'number' &&
		navigator.hardwareConcurrency <= 4;

	return !isMobile && !prefersReducedMotion && !isLowEndDevice;
};

export default function DitherLazy() {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		if (!shouldEnableDither()) return;

		const win = globalThis as Window & typeof globalThis;
		const enable = () => setEnabled(true);
		if ('requestIdleCallback' in win) {
			const id = win.requestIdleCallback(enable, { timeout: 2500 });
			return () => win.cancelIdleCallback(id);
		}

		const timeout = setTimeout(enable, 1800);
		return () => clearTimeout(timeout);
	}, []);

	if (!enabled) return null;
	return <Dither />;
}
