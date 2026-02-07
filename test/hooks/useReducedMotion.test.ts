import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion, useIsMobile, throttle } from '@/hooks/useReducedMotion';

describe('useReducedMotion', () => {
	let matchMediaMock: any;
	let addEventListenerSpy: any;
	let removeEventListenerSpy: any;

	beforeEach(() => {
		addEventListenerSpy = vi.fn();
		removeEventListenerSpy = vi.fn();

		matchMediaMock = vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: addEventListenerSpy,
			removeEventListener: removeEventListenerSpy,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: matchMediaMock,
		});

		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 1024,
		});

		Object.defineProperty(navigator, 'hardwareConcurrency', {
			writable: true,
			configurable: true,
			value: 8,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns false by default when no reduced motion preference', () => {
		const { result } = renderHook(() => useReducedMotion());
		expect(result.current).toBe(false);
	});

	it('returns true when user prefers reduced motion', () => {
		matchMediaMock.mockImplementation((query: string) => ({
			matches: query.includes('prefers-reduced-motion'),
			media: query,
			addEventListener: addEventListenerSpy,
			removeEventListener: removeEventListenerSpy,
		}));

		const { result } = renderHook(() => useReducedMotion());
		expect(result.current).toBe(true);
	});

	it('returns true for mobile devices with low hardware', () => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 500,
		});

		Object.defineProperty(navigator, 'hardwareConcurrency', {
			writable: true,
			configurable: true,
			value: 2,
		});

		const { result } = renderHook(() => useReducedMotion());
		expect(result.current).toBe(true);
	});

	it('adds and removes event listener on mount/unmount', () => {
		const { unmount } = renderHook(() => useReducedMotion());

		expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
	});

	it('updates when media query changes', () => {
		let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

		matchMediaMock.mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: (event: string, handler: (e: MediaQueryListEvent) => void) => {
				if (event === 'change') {
					changeHandler = handler;
				}
			},
			removeEventListener: vi.fn(),
		}));

		const { result } = renderHook(() => useReducedMotion());
		expect(result.current).toBe(false);

		act(() => {
			if (changeHandler) {
				changeHandler({ matches: true } as MediaQueryListEvent);
			}
		});

		expect(result.current).toBe(true);
	});
});

describe('useIsMobile', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 1024,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns false for desktop width', () => {
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it('returns true for mobile width', () => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: 500,
		});

		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it('updates on window resize', () => {
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		act(() => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				value: 500,
			});
			window.dispatchEvent(new Event('resize'));
		});

		expect(result.current).toBe(true);
	});
});

describe('throttle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('calls function immediately on first call', () => {
		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('throttles subsequent calls', () => {
		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled();
		throttled();
		throttled();

		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('calls function again after throttle period', () => {
		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled();
		expect(fn).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(100);
		
		throttled();
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('calls with latest arguments after throttle period', () => {
		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled('first');
		throttled('second');
		throttled('third');

		expect(fn).toHaveBeenCalledWith('first');

		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith('third');
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('preserves this context', () => {
		const obj = {
			value: 42,
			fn: vi.fn(function(this: { value: number }) {
				return this.value;
			}),
		};

		const throttled = throttle(obj.fn.bind(obj), 100);
		throttled();

		expect(obj.fn).toHaveBeenCalled();
	});
});

