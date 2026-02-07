import { describe, it, expect } from 'vitest';
import { validateUrl, getUrl, joinUrl } from '@/helpers/url';

describe('validateUrl', () => {
	it('returns true for valid HTTP URLs', () => {
		expect(validateUrl('http://example.com')).toBe(true);
		expect(validateUrl('http://www.example.com')).toBe(true);
		expect(validateUrl('http://example.com/path')).toBe(true);
		expect(validateUrl('http://example.com/path?query=value')).toBe(true);
	});

	it('returns true for valid HTTPS URLs', () => {
		expect(validateUrl('https://example.com')).toBe(true);
		expect(validateUrl('https://www.example.com')).toBe(true);
		expect(validateUrl('https://example.com/path/to/page')).toBe(true);
		expect(validateUrl('https://example.com:8080')).toBe(true);
	});

	it('returns false for invalid URLs', () => {
		expect(validateUrl('')).toBe(false);
		expect(validateUrl('not-a-url')).toBe(false);
		expect(validateUrl('example.com')).toBe(false);
		expect(validateUrl('ftp://example.com')).toBe(false);
	});

	it('returns false for undefined or null', () => {
		expect(validateUrl(undefined)).toBe(false);
		expect(validateUrl(null)).toBe(false);
	});

	it('handles URL protocols correctly', () => {
		// validateUrl only checks if URL starts with http:// or https://
		expect(validateUrl('http://')).toBe(true); // Starts with http://
		expect(validateUrl('https://')).toBe(true); // Starts with https://
		expect(validateUrl('http://localhost')).toBe(true);
		expect(validateUrl('http://localhost:3000')).toBe(true);
		expect(validateUrl('http://127.0.0.1')).toBe(true);
	});
});

describe('URL Edge Cases', () => {
	it('handles URLs with special characters', () => {
		expect(validateUrl('https://example.com/path?name=John%20Doe')).toBe(true);
		expect(validateUrl('https://example.com/path#section')).toBe(true);
		expect(validateUrl('https://example.com/path?a=1&b=2')).toBe(true);
	});

	it('handles international domain names', () => {
		expect(validateUrl('https://пример.com')).toBe(true);
		expect(validateUrl('https://例え.jp')).toBe(true);
	});

	it('handles subdomains', () => {
		expect(validateUrl('https://api.example.com')).toBe(true);
		expect(validateUrl('https://cdn.api.example.com')).toBe(true);
		expect(validateUrl('https://a.b.c.example.com')).toBe(true);
	});
});

describe('joinUrl', () => {
	it('joins URL parts correctly', () => {
		expect(joinUrl('https://example.com', 'api', 'users')).toBe('https://example.com/api/users');
	});

	it('handles trailing slashes', () => {
		expect(joinUrl('https://example.com/', '/api/', '/users/')).toBe('https://example.com/api/users');
	});

	it('handles empty parts', () => {
		expect(joinUrl('https://example.com', '', 'api')).toBe('https://example.com/api');
	});

	it('handles single part', () => {
		expect(joinUrl('https://example.com')).toBe('https://example.com');
	});
});
