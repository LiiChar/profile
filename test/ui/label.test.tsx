import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from '@/components/ui/label';

describe('<Label />', () => {
	it('renders with default props', () => {
		render(<Label data-testid="label">Test Label</Label>);
		const label = screen.getByTestId('label');
		expect(label).toBeInTheDocument();
		expect(label).toHaveAttribute('data-slot', 'label');
		expect(label).toHaveTextContent('Test Label');
	});

	it('renders with htmlFor attribute', () => {
		render(<Label htmlFor="input-id" data-testid="label">Label</Label>);
		const label = screen.getByTestId('label');
		expect(label).toHaveAttribute('for', 'input-id');
	});

	it('applies custom className', () => {
		render(<Label className="custom-label" data-testid="label">Label</Label>);
		const label = screen.getByTestId('label');
		expect(label).toHaveClass('custom-label');
	});

	it('renders with children elements', () => {
		render(
			<Label data-testid="label">
				<span>Icon</span>
				Username
			</Label>
		);
		const label = screen.getByTestId('label');
		expect(label).toContainHTML('<span>Icon</span>');
		expect(label).toHaveTextContent('Username');
	});

	it('forwards additional props', () => {
		render(
			<Label 
				data-testid="label" 
				id="my-label"
				aria-describedby="description"
			>
				Label
			</Label>
		);
		const label = screen.getByTestId('label');
		expect(label).toHaveAttribute('id', 'my-label');
		expect(label).toHaveAttribute('aria-describedby', 'description');
	});

	it('works with associated input', () => {
		render(
			<div>
				<Label htmlFor="test-input">Email</Label>
				<input id="test-input" type="email" />
			</div>
		);
		const label = screen.getByText('Email');
		const input = screen.getByRole('textbox');
		
		expect(label).toHaveAttribute('for', 'test-input');
		expect(input).toHaveAttribute('id', 'test-input');
	});
});

