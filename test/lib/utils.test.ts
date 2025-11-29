import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
	it('combines class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('merges Tailwind classes correctly', () => {
		expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8');
	});

	it('handles conditional classes', () => {
		expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
	});

	it('filters out falsy values', () => {
		expect(cn('foo', undefined, null, false, '', 'bar')).toBe('foo bar');
	});

	it('handles arrays', () => {
		expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
	});

	it('handles nested arrays', () => {
		expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
	});

	it('returns empty string for no arguments', () => {
		expect(cn()).toBe('');
	});

	it('handles single class', () => {
		expect(cn('single')).toBe('single');
	});

	it('merges px classes properly', () => {
		expect(cn('px-2 py-4', 'px-4')).toBe('py-4 px-4');
		expect(cn('px-4', 'px-2 py-4')).toBe('px-2 py-4');
	});

	it('merges complex Tailwind combinations', () => {
		expect(
			cn(
				'inline-flex items-center justify-center gap-2',
				'rounded-md text-sm font-medium',
				'bg-primary text-primary-foreground',
				'rounded-lg' // This should override the rounded-md
			)
		).toBe(
			'inline-flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg'
		);
	});
});
