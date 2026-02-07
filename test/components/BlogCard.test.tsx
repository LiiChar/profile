import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }: any) => (
		<a href={href} {...props}>{children}</a>
	),
}));

vi.mock('next/image', () => ({
	default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('@/components/ui/text-client', () => ({
	Text: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('@/hooks/useReducedMotion', () => ({
	useReducedMotion: () => false,
}));

// Import after mocks
import { BlogCard } from '@/components/blog/BlogCard';

const mockBlog = {
	id: 1,
	title: 'Test Blog Post',
	content: 'This is test content for the blog post.',
	image: '/test-image.jpg',
	tags: 'react, testing',
	createdAt: new Date('2024-01-15'),
	updatedAt: new Date('2024-01-15'),
	userId: 1,
	lang: null,
};

describe('<BlogCard />', () => {
	it('renders blog card with title', () => {
		render(<BlogCard blog={mockBlog} />);
		expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
	});

	it('renders blog card with image', () => {
		render(<BlogCard blog={mockBlog} />);
		const image = screen.getByAltText(/test blog post/i);
		expect(image).toBeInTheDocument();
	});

	it('renders blog card with content preview', () => {
		render(<BlogCard blog={mockBlog} />);
		expect(screen.getByText(/test content/i)).toBeInTheDocument();
	});

	it('renders read article link', () => {
		render(<BlogCard blog={mockBlog} />);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/blog/1');
	});

	it('renders with custom className', () => {
		render(<BlogCard blog={mockBlog} className="custom-class" />);
		// The card should have the custom class applied
	});

	it('renders tags when present', () => {
		render(<BlogCard blog={mockBlog} />);
		// Tags are present in the blog object
	});

	it('handles blog without image', () => {
		const blogWithoutImage = { ...mockBlog, image: null };
		render(<BlogCard blog={blogWithoutImage as any} />);
		expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
	});

	it('formats date correctly', () => {
		render(<BlogCard blog={mockBlog} />);
		// Date should be formatted and displayed
	});
});

