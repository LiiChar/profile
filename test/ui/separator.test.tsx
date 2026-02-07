import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from '@/components/ui/separator';

describe('<Separator />', () => {
	it('renders with default props (horizontal)', () => {
		render(<Separator data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toBeInTheDocument();
		expect(separator).toHaveAttribute('data-slot', 'separator');
		expect(separator).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('renders vertical separator', () => {
		render(<Separator orientation="vertical" data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toHaveAttribute('data-orientation', 'vertical');
	});

	it('applies decorative role by default', () => {
		render(<Separator data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toHaveAttribute('role', 'none');
	});

	it('applies separator role when not decorative', () => {
		render(<Separator decorative={false} data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toHaveAttribute('role', 'separator');
	});

	it('applies custom className', () => {
		render(<Separator className="custom-separator" data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toHaveClass('custom-separator');
	});

	it('forwards additional props', () => {
		render(<Separator id="my-separator" aria-label="divider" data-testid="separator" />);
		const separator = screen.getByTestId('separator');
		expect(separator).toHaveAttribute('id', 'my-separator');
		expect(separator).toHaveAttribute('aria-label', 'divider');
	});
});

