import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '@/components/ui/switch';

describe('<Switch />', () => {
	it('renders with default props', () => {
		render(<Switch data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toBeInTheDocument();
		expect(switchEl).toHaveAttribute('data-slot', 'switch');
	});

	it('renders unchecked by default', () => {
		render(<Switch data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
	});

	it('renders checked when defaultChecked is true', () => {
		render(<Switch defaultChecked data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'checked');
	});

	it('toggles state on click', () => {
		render(<Switch data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		fireEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'checked');
		fireEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
	});

	it('handles controlled state', () => {
		const handleChange = vi.fn();
		const { rerender } = render(
			<Switch checked={false} onCheckedChange={handleChange} data-testid="switch" />
		);
		
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		
		fireEvent.click(switchEl);
		expect(handleChange).toHaveBeenCalledWith(true);

		rerender(<Switch checked={true} onCheckedChange={handleChange} data-testid="switch" />);
		expect(switchEl).toHaveAttribute('data-state', 'checked');
	});

	it('handles disabled state', () => {
		render(<Switch disabled data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toBeDisabled();
	});

	it('does not toggle when disabled', () => {
		const handleChange = vi.fn();
		render(<Switch disabled onCheckedChange={handleChange} data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		
		fireEvent.click(switchEl);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('applies custom className', () => {
		render(<Switch className="custom-switch" data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toHaveClass('custom-switch');
	});

	it('handles keyboard interaction', () => {
		render(<Switch data-testid="switch" />);
		const switchEl = screen.getByTestId('switch');
		
		switchEl.focus();
		expect(switchEl).toHaveFocus();
		
		fireEvent.keyDown(switchEl, { key: ' ' });
		expect(switchEl).toHaveAttribute('data-state', 'checked');
	});

	it('forwards additional props', () => {
		render(
			<Switch 
				data-testid="switch" 
				name="mySwitch"
				id="switch-id"
				aria-label="Toggle feature"
			/>
		);
		const switchEl = screen.getByTestId('switch');
		expect(switchEl).toHaveAttribute('name', 'mySwitch');
		expect(switchEl).toHaveAttribute('id', 'switch-id');
		expect(switchEl).toHaveAttribute('aria-label', 'Toggle feature');
	});
});

