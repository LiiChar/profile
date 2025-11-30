import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('<Button />', () => {
	it('renders with default variant and size', () => {
		render(<Button>Test Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Test Button');
		expect(button).toHaveClass('bg-primary');
		expect(button).toHaveClass('h-9');
	});

	it('renders with different variants', () => {
		const { rerender } = render(<Button variant="destructive">Destructive</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-destructive');

		rerender(<Button variant="outline">Outline</Button>);
		expect(screen.getByRole('button')).toHaveClass('border');

		rerender(<Button variant="secondary">Secondary</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-secondary');

		rerender(<Button variant="ghost">Ghost</Button>);
		expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');

		rerender(<Button variant="link">Link</Button>);
		expect(screen.getByRole('button')).toHaveClass('underline-offset-4');
	});

	it('renders with different sizes', () => {
		const { rerender } = render(<Button size="sm">Small</Button>);
		expect(screen.getByRole('button')).toHaveClass('h-8');

		rerender(<Button size="lg">Large</Button>);
		expect(screen.getByRole('button')).toHaveClass('h-10');

		rerender(<Button size="icon">Icon</Button>);
		expect(screen.getByRole('button')).toHaveClass('size-9');
	});

	it('handles click events', () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click Me</Button>);
		const button = screen.getByRole('button');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('handles disabled state', () => {
		render(<Button disabled>Disabled Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveClass('disabled:opacity-50');
	});

	it('applies custom className', () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('forwards other props to button element', () => {
		render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
		const button = screen.getByTestId('submit-btn');
		expect(button).toHaveAttribute('type', 'submit');
	});

	it('renders with asChild using Slot', () => {
		render(
			<Button asChild>
				<a href="/test" data-testid="link-button">Link Button</a>
			</Button>
		);
		const link = screen.getByTestId('link-button');
		expect(link).toHaveAttribute('href', '/test');
		expect(link).toBeInTheDocument();
	});
});
