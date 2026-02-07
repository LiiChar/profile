import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

describe('<Tooltip />', () => {
	it('renders trigger element', () => {
		render(
			<Tooltip>
				<TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
				<TooltipContent>Tooltip content</TooltipContent>
			</Tooltip>
		);
		
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveTextContent('Hover me');
	});

	it('tooltip content is hidden by default', () => {
		render(
			<Tooltip>
				<TooltipTrigger>Hover me</TooltipTrigger>
				<TooltipContent>Tooltip content</TooltipContent>
			</Tooltip>
		);
		
		expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
	});

	it('renders TooltipProvider with custom delay', () => {
		render(
			<TooltipProvider delayDuration={500}>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Content</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
		
		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('trigger has correct data-slot attribute', () => {
		render(
			<Tooltip>
				<TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
				<TooltipContent>Content</TooltipContent>
			</Tooltip>
		);
		
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger');
	});

	it('applies custom className to trigger', () => {
		render(
			<Tooltip>
				<TooltipTrigger className="custom-trigger" data-testid="trigger">
					Hover me
				</TooltipTrigger>
				<TooltipContent>Content</TooltipContent>
			</Tooltip>
		);
		
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveClass('custom-trigger');
	});

	it('renders with asChild on trigger', () => {
		render(
			<Tooltip>
				<TooltipTrigger asChild>
					<button data-testid="btn-trigger">Button Trigger</button>
				</TooltipTrigger>
				<TooltipContent>Content</TooltipContent>
			</Tooltip>
		);
		
		const button = screen.getByTestId('btn-trigger');
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});
});

