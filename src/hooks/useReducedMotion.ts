'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion or is on a low-end device
 * Used to disable heavy animations for better performance
 */
export function useReducedMotion(): boolean {
	const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

	useEffect(() => {
		// Check if user prefers reduced motion
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		// Check if it's a mobile device
		const isMobile = window.innerWidth < 768;

		// Check for low-end device (4 or fewer CPU cores)
		const isLowEndDevice =
			navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

		// Check for slow connection
		const connection =
			(navigator as Navigator & { connection?: { effectiveType?: string } })
				.connection;
		const isSlowConnection =
			connection?.effectiveType === 'slow-2g' ||
			connection?.effectiveType === '2g' ||
			connection?.effectiveType === '3g';

		// Check device memory (if available)
		const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
			.deviceMemory;
		const isLowMemory = deviceMemory !== undefined && deviceMemory < 4;

		setShouldReduceMotion(
			prefersReducedMotion ||
				(isMobile && (!!isLowEndDevice || isSlowConnection || isLowMemory))
		);

		// Listen for changes in motion preference
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handleChange = (e: MediaQueryListEvent) => {
			setShouldReduceMotion(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return shouldReduceMotion;
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();

		window.addEventListener('resize', checkMobile, { passive: true });
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return isMobile;
}

/**
 * Throttle function for scroll handlers
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle = false;
	let lastArgs: Parameters<T> | null = null;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
				if (lastArgs) {
					func.apply(this, lastArgs);
					lastArgs = null;
				}
			}, limit);
		} else {
			lastArgs = args;
		}
	};
}

