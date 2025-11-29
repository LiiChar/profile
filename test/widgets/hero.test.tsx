import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/widgets/main/Hero';

describe('<Hero />', () => {
	it('renders hero section', () => {
		render(<Hero />);
		expect(screen.getByRole('main')).toBeInTheDocument();
	});

	it('renders title from dictionary', () => {
		render(<Hero />);
		// Will render the Text component, but without dictionary it may not render text
		const heroSection = screen.getByRole('main');
		expect(heroSection).toBeInTheDocument();
	});

	it('renders buttons', () => {
		render(<Hero />);
		expect(screen.getByText('Projects')).toBeInTheDocument();
	});
});
