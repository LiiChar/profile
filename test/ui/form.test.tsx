import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Test component that uses the Form components
const TestForm = ({ onSubmit = vi.fn() }: { onSubmit?: (data: any) => void }) => {
	const form = useForm({
		defaultValues: {
			username: '',
			email: '',
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} data-testid="form">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Enter username" {...field} />
							</FormControl>
							<FormDescription>Your unique username</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Enter email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<button type="submit">Submit</button>
			</form>
		</Form>
	);
};

describe('Form Components', () => {
	it('renders form with fields', () => {
		render(<TestForm />);
		
		expect(screen.getByTestId('form')).toBeInTheDocument();
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
	});

	it('renders form labels', () => {
		render(<TestForm />);
		
		expect(screen.getByText('Username')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
	});

	it('renders form description', () => {
		render(<TestForm />);
		
		expect(screen.getByText('Your unique username')).toBeInTheDocument();
	});

	it('handles input changes', async () => {
		render(<TestForm />);
		
		const usernameInput = screen.getByPlaceholderText('Enter username');
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		
		expect(usernameInput).toHaveValue('testuser');
	});

	it('submits form with data', async () => {
		const handleSubmit = vi.fn();
		render(<TestForm onSubmit={handleSubmit} />);
		
		const usernameInput = screen.getByPlaceholderText('Enter username');
		const emailInput = screen.getByPlaceholderText('Enter email');
		
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
		
		fireEvent.click(screen.getByText('Submit'));
		
		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					username: 'testuser',
					email: 'test@example.com',
				}),
				expect.anything()
			);
		});
	});

	it('has accessible form structure', () => {
		render(<TestForm />);
		
		const usernameInput = screen.getByPlaceholderText('Enter username');
		const emailInput = screen.getByPlaceholderText('Enter email');
		
		// Inputs should be associated with labels
		expect(usernameInput).toHaveAccessibleName(/username/i);
		expect(emailInput).toHaveAccessibleName(/email/i);
	});
});

