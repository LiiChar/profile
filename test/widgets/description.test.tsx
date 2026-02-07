import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
	},
}));

vi.mock('@/hooks/useReducedMotion', () => ({
	useReducedMotion: () => false,
}));

vi.mock('@/components/ui/text-client', () => ({
	Text: ({ text }: { text: string }) => <span data-testid="text">{text}</span>,
}));

vi.mock('@/components/generate/GenerateFetch', () => ({
	GenerateFetch: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Import after mocks
import { Description } from '@/widgets/main/Description';

describe('<Description />', () => {
	it('renders the description section', () => {
		render(<Description />);
		expect(screen.getByTestId('description')).toBeInTheDocument();
	});

	it('has correct id attribute for navigation', () => {
		render(<Description />);
		const section = screen.getByTestId('description');
		expect(section).toHaveAttribute('id', 'description');
	});

	it('renders title text', () => {
		render(<Description />);
		const titles = screen.getAllByTestId('text');
		const titleExists = titles.some(t => t.textContent?.includes('description.title'));
		expect(titleExists).toBe(true);
	});

	it('renders content text', () => {
		render(<Description />);
		const texts = screen.getAllByTestId('text');
		expect(texts.length).toBeGreaterThan(0);
	});

	it('applies correct section styling', () => {
		render(<Description />);
		const section = screen.getByTestId('description');
		expect(section).toHaveClass('min-h-screen');
	});
});

