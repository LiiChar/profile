import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '@/components/ui/input';

describe('<Input />', () => {
	it('renders with default props', () => {
		render(<Input data-testid="input" />);
		const input = screen.getByTestId('input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('data-slot', 'input');
	});

	it('renders with placeholder', () => {
		render(<Input placeholder="Enter text..." />);
		const input = screen.getByPlaceholderText('Enter text...');
		expect(input).toBeInTheDocument();
	});

	it('renders with different types', () => {
		const { rerender } = render(<Input type="text" data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');

		rerender(<Input type="password" data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');

		rerender(<Input type="email" data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

		rerender(<Input type="number" data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
	});

	it('handles value changes', () => {
		const handleChange = vi.fn();
		render(<Input onChange={handleChange} data-testid="input" />);
		const input = screen.getByTestId('input');
		
		fireEvent.change(input, { target: { value: 'test value' } });
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles controlled value', () => {
		const { rerender } = render(<Input value="initial" readOnly data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveValue('initial');

		rerender(<Input value="updated" readOnly data-testid="input" />);
		expect(screen.getByTestId('input')).toHaveValue('updated');
	});

	it('handles disabled state', () => {
		render(<Input disabled data-testid="input" />);
		const input = screen.getByTestId('input');
		expect(input).toBeDisabled();
	});

	it('handles required state', () => {
		render(<Input required data-testid="input" />);
		const input = screen.getByTestId('input');
		expect(input).toBeRequired();
	});

	it('handles aria-invalid state', () => {
		render(<Input aria-invalid="true" data-testid="input" />);
		const input = screen.getByTestId('input');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('applies custom className', () => {
		render(<Input className="custom-class" data-testid="input" />);
		const input = screen.getByTestId('input');
		expect(input).toHaveClass('custom-class');
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		render(<Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />);
		const input = screen.getByTestId('input');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		const handleKeyUp = vi.fn();
		render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} data-testid="input" />);
		const input = screen.getByTestId('input');

		fireEvent.keyDown(input, { key: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalledTimes(1);

		fireEvent.keyUp(input, { key: 'Enter' });
		expect(handleKeyUp).toHaveBeenCalledTimes(1);
	});

	it('forwards additional props', () => {
		render(
			<Input 
				data-testid="input" 
				name="testInput" 
				id="test-id"
				maxLength={10}
				minLength={2}
			/>
		);
		const input = screen.getByTestId('input');
		expect(input).toHaveAttribute('name', 'testInput');
		expect(input).toHaveAttribute('id', 'test-id');
		expect(input).toHaveAttribute('maxLength', '10');
		expect(input).toHaveAttribute('minLength', '2');
	});
});

