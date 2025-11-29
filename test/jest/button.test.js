import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import '@testing-library/jest-dom';

describe('Button Component (Jest)', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies default variant classes', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-primary');
    expect(buttonElement).toHaveClass('h-9');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
  });

  test('applies disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  test('forwards other props', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const buttonElement = screen.getByTestId('submit-btn');
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
