import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateText } from '@/action/generate';

// Mock Google GenAI
vi.mock('@google/genai', () => ({
	GoogleGenAI: vi.fn().mockImplementation(() => ({
		models: {
			generateContent: vi.fn().mockResolvedValue({
				text: 'Generated text content',
			}),
		},
	})),
}));

describe('generateText', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(generateText).toBeDefined();
	});

	// Note: Full testing requires mocking the generate action
	// which depends on external API configuration
});

