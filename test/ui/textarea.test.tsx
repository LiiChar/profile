import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from '@/components/ui/textarea';

describe('<Textarea />', () => {
	it('renders with default props', () => {
		render(<Textarea data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveAttribute('data-slot', 'textarea');
	});

	it('renders with placeholder', () => {
		render(<Textarea placeholder="Enter description..." />);
		const textarea = screen.getByPlaceholderText('Enter description...');
		expect(textarea).toBeInTheDocument();
	});

	it('handles value changes', () => {
		const handleChange = vi.fn();
		render(<Textarea onChange={handleChange} data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		
		fireEvent.change(textarea, { target: { value: 'test content' } });
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles controlled value', () => {
		const { rerender } = render(<Textarea value="initial" readOnly data-testid="textarea" />);
		expect(screen.getByTestId('textarea')).toHaveValue('initial');

		rerender(<Textarea value="updated" readOnly data-testid="textarea" />);
		expect(screen.getByTestId('textarea')).toHaveValue('updated');
	});

	it('handles disabled state', () => {
		render(<Textarea disabled data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toBeDisabled();
	});

	it('handles required state', () => {
		render(<Textarea required data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toBeRequired();
	});

	it('handles aria-invalid state', () => {
		render(<Textarea aria-invalid="true" data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toHaveAttribute('aria-invalid', 'true');
	});

	it('applies custom className', () => {
		render(<Textarea className="custom-class" data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toHaveClass('custom-class');
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		render(<Textarea onFocus={handleFocus} onBlur={handleBlur} data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');

		fireEvent.focus(textarea);
		expect(handleFocus).toHaveBeenCalledTimes(1);

		fireEvent.blur(textarea);
		expect(handleBlur).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		render(<Textarea onKeyDown={handleKeyDown} data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');

		fireEvent.keyDown(textarea, { key: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalledTimes(1);
	});

	it('forwards additional props', () => {
		render(
			<Textarea 
				data-testid="textarea" 
				name="testTextarea" 
				id="test-id"
				rows={5}
				cols={30}
				maxLength={500}
			/>
		);
		const textarea = screen.getByTestId('textarea');
		expect(textarea).toHaveAttribute('name', 'testTextarea');
		expect(textarea).toHaveAttribute('id', 'test-id');
		expect(textarea).toHaveAttribute('rows', '5');
		expect(textarea).toHaveAttribute('cols', '30');
		expect(textarea).toHaveAttribute('maxLength', '500');
	});

	it('handles multiline text input', () => {
		render(<Textarea data-testid="textarea" />);
		const textarea = screen.getByTestId('textarea');
		
		const multilineText = 'Line 1\nLine 2\nLine 3';
		fireEvent.change(textarea, { target: { value: multilineText } });
		expect(textarea).toHaveValue(multilineText);
	});
});

