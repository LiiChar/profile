import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
	},
	AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/hooks/useReducedMotion', () => ({
	useReducedMotion: () => false,
}));

vi.mock('@/components/ui/text-client', () => ({
	Text: ({ text }: { text: string }) => <span data-testid="text">{text}</span>,
}));

vi.mock('@react-three/fiber', () => ({
	Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
}));

vi.mock('@react-three/postprocessing', () => ({
	EffectComposer: () => null,
	Bloom: () => null,
}));

// Import after mocks
import { Knowledge } from '@/widgets/main/Knowledge';

describe('<Knowledge />', () => {
	it('renders the knowledge section', () => {
		render(<Knowledge />);
		const section = document.getElementById('knowledge');
		expect(section).toBeInTheDocument();
	});

	it('has correct id attribute for navigation', () => {
		render(<Knowledge />);
		const section = document.getElementById('knowledge');
		expect(section).toBeTruthy();
	});

	it('renders skill categories', () => {
		render(<Knowledge />);
		const texts = screen.getAllByTestId('text');
		expect(texts.length).toBeGreaterThan(0);
	});
});

