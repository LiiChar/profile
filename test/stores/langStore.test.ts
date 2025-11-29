import { describe, expect, it, beforeEach } from 'vitest';
import { useDictionaryStore } from '@/stores/lang/langStore';
import { act, renderHook } from '@testing-library/react';

describe('useDictionaryStore', () => {
	beforeEach(() => {
		// Reset store state before each test
		const { result } = renderHook(() => useDictionaryStore());
		act(() => {
			result.current.setDictionary(null as any);
		});
	});

	it('should initialize with null dictionary', () => {
		const { result } = renderHook(() => useDictionaryStore());
		expect(result.current.dictionary).toBeNull();
	});

	it('should set dictionary correctly', () => {
		const { result } = renderHook(() => useDictionaryStore());

		const testDictionary = {
			home: {
				title: 'Главная',
			},
			nav: {
				about: 'О нас',
			},
		} as any;

		act(() => {
			result.current.setDictionary(testDictionary);
		});

		expect(result.current.dictionary).toEqual(testDictionary);
	});

	it('should update dictionary with new values', () => {
		const { result } = renderHook(() => useDictionaryStore());

		const initialDict = {
			home: { title: 'Home' },
		} as any;

		const updatedDict = {
			...initialDict,
			nav: { about: 'About' },
		} as any;

		act(() => {
			result.current.setDictionary(initialDict);
		});

		expect(result.current.dictionary).toEqual(initialDict);

		act(() => {
			result.current.setDictionary(updatedDict);
		});

		expect(result.current.dictionary).toEqual(updatedDict);
	});

	it('should be reactive across multiple components', () => {
		const { result: result1 } = renderHook(() => useDictionaryStore());
		const { result: result2 } = renderHook(() => useDictionaryStore());

		const testDictionary = {
			common: { save: 'Сохранить' },
		} as any;

		act(() => {
			result1.current.setDictionary(testDictionary);
		});

		// Both components should have the updated dictionary
		expect(result1.current.dictionary).toEqual(testDictionary);
		expect(result2.current.dictionary).toEqual(testDictionary);
	});

	it('should handle empty dictionary', () => {
		const { result } = renderHook(() => useDictionaryStore());

		act(() => {
			result.current.setDictionary({} as any);
		});

		expect(result.current.dictionary).toEqual({});
	});
});
