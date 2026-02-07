import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Navigation } from '@/widgets/main/Navigation';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

// Mock useReducedMotion
vi.mock('@/hooks/useReducedMotion', () => ({
	useReducedMotion: () => false,
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

describe('<Navigation />', () => {
	beforeEach(() => {
		// Create mock sections
		const sections = ['hero', 'description', 'knowledge', 'portfolio', 'blog'];
		sections.forEach(id => {
			const el = document.createElement('div');
			el.id = id;
			document.body.appendChild(el);
		});
	});

	afterEach(() => {
		// Cleanup mock sections
		const sections = ['hero', 'description', 'knowledge', 'portfolio', 'blog'];
		sections.forEach(id => {
			const el = document.getElementById(id);
			if (el) el.remove();
		});
		vi.clearAllMocks();
	});

	it('renders navigation sidebar', () => {
		render(<Navigation>Content</Navigation>);
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('renders all navigation items', () => {
		render(<Navigation />);
		
		expect(screen.getByLabelText(/Главная/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Обо мне/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Навыки/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Портфолио/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Блог/i)).toBeInTheDocument();
	});

	it('navigation items are clickable', () => {
		const scrollIntoViewMock = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoViewMock;

		render(<Navigation />);
		
		const navItem = screen.getByLabelText(/Главная/i);
		fireEvent.click(navItem);
		
		expect(scrollIntoViewMock).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		});
	});

	it('navigation items respond to Enter key', () => {
		const scrollIntoViewMock = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoViewMock;

		render(<Navigation />);
		
		const navItem = screen.getByLabelText(/Навыки/i);
		fireEvent.keyDown(navItem, { key: 'Enter' });
		
		expect(scrollIntoViewMock).toHaveBeenCalled();
	});

	it('renders with custom components', () => {
		const customComponents = {
			section1: { title: 'Section 1', icon: <span>1</span> },
			section2: { title: 'Section 2', icon: <span>2</span> },
		};

		// Create elements for custom sections
		['section1', 'section2'].forEach(id => {
			const el = document.createElement('div');
			el.id = id;
			document.body.appendChild(el);
		});

		render(<Navigation components={customComponents as any} />);
		
		expect(screen.getByLabelText(/Section 1/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Section 2/i)).toBeInTheDocument();

		// Cleanup
		['section1', 'section2'].forEach(id => {
			document.getElementById(id)?.remove();
		});
	});

	it('navigation items have correct accessibility attributes', () => {
		render(<Navigation />);
		
		const navItems = screen.getAllByRole('button');
		navItems.forEach(item => {
			expect(item).toHaveAttribute('tabIndex', '0');
			expect(item).toHaveAttribute('aria-current');
			expect(item).toHaveAttribute('aria-label');
		});
	});

	it('renders children content', () => {
		render(
			<Navigation>
				<div data-testid="child-content">Child Content</div>
			</Navigation>
		);
		
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	it('sets up IntersectionObserver on mount', () => {
		render(<Navigation />);
		expect(mockIntersectionObserver).toHaveBeenCalled();
	});

	it('cleans up IntersectionObserver on unmount', () => {
		const disconnectMock = vi.fn();
		mockIntersectionObserver.mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: disconnectMock,
		}));

		const { unmount } = render(<Navigation />);
		unmount();
		
		expect(disconnectMock).toHaveBeenCalled();
	});
});

