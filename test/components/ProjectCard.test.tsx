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

vi.mock('@/helpers/url', () => ({
	validateUrl: (url: string) => url?.startsWith('http'),
}));

vi.mock('@/hooks/useReducedMotion', () => ({
	useReducedMotion: () => false,
}));

// Import after mocks
import { ProjectCard } from '@/components/project/ProjectCard';

const mockProject = {
	id: 1,
	title: 'Test Project',
	description: 'A test project description',
	content: 'Full content of the project',
	image: '/project-image.jpg',
	url: 'https://example.com',
	author: 'LiiChar',
	repoName: 'test-repo',
	tags: 'react, nextjs',
	createdAt: new Date('2024-01-15'),
	updatedAt: new Date('2024-01-15'),
	userId: 1,
	lang: null,
};

describe('<ProjectCard />', () => {
	it('renders project card with title', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText('Test Project')).toBeInTheDocument();
	});

	it('renders project card with description', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText(/test project description/i)).toBeInTheDocument();
	});

	it('renders project card with image', () => {
		render(<ProjectCard project={mockProject} />);
		const image = screen.getByAltText(/test project/i);
		expect(image).toBeInTheDocument();
	});

	it('renders link to project page', () => {
		render(<ProjectCard project={mockProject} />);
		const links = screen.getAllByRole('link');
		const projectLink = links.find(link => link.getAttribute('href')?.includes('/projects/1'));
		expect(projectLink).toBeTruthy();
	});

	it('renders external link when URL is provided', () => {
		render(<ProjectCard project={mockProject} />);
		const links = screen.getAllByRole('link');
		const externalLink = links.find(link => link.getAttribute('href') === 'https://example.com');
		expect(externalLink).toBeTruthy();
	});

	it('renders with custom className', () => {
		render(<ProjectCard project={mockProject} className="custom-class" />);
		// Card should accept custom className
	});

	it('handles project without URL', () => {
		const projectWithoutUrl = { ...mockProject, url: null };
		render(<ProjectCard project={projectWithoutUrl as any} />);
		expect(screen.getByText('Test Project')).toBeInTheDocument();
	});

	it('handles project without image', () => {
		const projectWithoutImage = { ...mockProject, image: null };
		render(<ProjectCard project={projectWithoutImage as any} />);
		expect(screen.getByText('Test Project')).toBeInTheDocument();
	});

	it('displays author name', () => {
		render(<ProjectCard project={mockProject} />);
		expect(screen.getByText(/LiiChar/i)).toBeInTheDocument();
	});
});

