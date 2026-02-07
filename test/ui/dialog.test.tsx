import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';

describe('<Dialog />', () => {
	it('renders trigger button', () => {
		render(
			<Dialog>
				<DialogTrigger data-testid="trigger">Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		);
		
		expect(screen.getByTestId('trigger')).toBeInTheDocument();
		expect(screen.getByText('Open Dialog')).toBeInTheDocument();
	});

	it('dialog content is hidden by default', () => {
		render(
			<Dialog>
				<DialogTrigger>Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Hidden Title</DialogTitle>
				</DialogContent>
			</Dialog>
		);
		
		expect(screen.queryByText('Hidden Title')).not.toBeInTheDocument();
	});

	it('opens dialog on trigger click', async () => {
		render(
			<Dialog>
				<DialogTrigger data-testid="trigger">Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Visible Title</DialogTitle>
				</DialogContent>
			</Dialog>
		);
		
		fireEvent.click(screen.getByTestId('trigger'));
		
		await waitFor(() => {
			expect(screen.getByText('Visible Title')).toBeInTheDocument();
		});
	});

	it('renders dialog with all subcomponents', async () => {
		render(
			<Dialog>
				<DialogTrigger data-testid="trigger">Open</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>Dialog description text</DialogDescription>
					</DialogHeader>
					<div>Dialog body content</div>
					<DialogFooter>
						<DialogClose>Close</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
		
		fireEvent.click(screen.getByTestId('trigger'));
		
		await waitFor(() => {
			expect(screen.getByText('Dialog Title')).toBeInTheDocument();
			expect(screen.getByText('Dialog description text')).toBeInTheDocument();
			expect(screen.getByText('Dialog body content')).toBeInTheDocument();
			expect(screen.getByText('Close')).toBeInTheDocument();
		});
	});

	it('closes dialog on close button click', async () => {
		render(
			<Dialog>
				<DialogTrigger data-testid="trigger">Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Title</DialogTitle>
					<DialogClose data-testid="close">Close</DialogClose>
				</DialogContent>
			</Dialog>
		);
		
		// Open dialog
		fireEvent.click(screen.getByTestId('trigger'));
		
		await waitFor(() => {
			expect(screen.getByText('Title')).toBeInTheDocument();
		});
		
		// Close dialog
		fireEvent.click(screen.getByTestId('close'));
		
		await waitFor(() => {
			expect(screen.queryByText('Title')).not.toBeInTheDocument();
		});
	});

	it('supports controlled open state', async () => {
		const TestComponent = () => {
			const [open, setOpen] = React.useState(false);
			return (
				<>
					<button onClick={() => setOpen(true)} data-testid="external-trigger">
						External Open
					</button>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent>
							<DialogTitle>Controlled Dialog</DialogTitle>
							<button onClick={() => setOpen(false)} data-testid="external-close">
								External Close
							</button>
						</DialogContent>
					</Dialog>
				</>
			);
		};
		
		render(<TestComponent />);
		
		expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();
		
		fireEvent.click(screen.getByTestId('external-trigger'));
		
		await waitFor(() => {
			expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
		});
		
		fireEvent.click(screen.getByTestId('external-close'));
		
		await waitFor(() => {
			expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();
		});
	});
});

