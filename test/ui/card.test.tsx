import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
} from '@/components/ui/card';

describe('<Card />', () => {
	it('renders with default props', () => {
		render(<Card data-testid="card">Card content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toBeInTheDocument();
		expect(card).toHaveAttribute('data-slot', 'card');
		expect(card).toHaveTextContent('Card content');
	});

	it('applies custom className', () => {
		render(<Card className="custom-class" data-testid="card">Content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toHaveClass('custom-class');
	});

	it('forwards additional props', () => {
		render(<Card id="my-card" role="region" data-testid="card">Content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toHaveAttribute('id', 'my-card');
		expect(card).toHaveAttribute('role', 'region');
	});
});

describe('<CardHeader />', () => {
	it('renders with default props', () => {
		render(<CardHeader data-testid="header">Header content</CardHeader>);
		const header = screen.getByTestId('header');
		expect(header).toBeInTheDocument();
		expect(header).toHaveAttribute('data-slot', 'card-header');
	});

	it('applies custom className', () => {
		render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
		expect(screen.getByTestId('header')).toHaveClass('custom-header');
	});
});

describe('<CardTitle />', () => {
	it('renders with default props', () => {
		render(<CardTitle data-testid="title">My Title</CardTitle>);
		const title = screen.getByTestId('title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveAttribute('data-slot', 'card-title');
		expect(title).toHaveTextContent('My Title');
	});

	it('applies custom className', () => {
		render(<CardTitle className="custom-title" data-testid="title">Title</CardTitle>);
		expect(screen.getByTestId('title')).toHaveClass('custom-title');
	});
});

describe('<CardDescription />', () => {
	it('renders with default props', () => {
		render(<CardDescription data-testid="desc">Description text</CardDescription>);
		const desc = screen.getByTestId('desc');
		expect(desc).toBeInTheDocument();
		expect(desc).toHaveAttribute('data-slot', 'card-description');
	});

	it('applies custom className', () => {
		render(<CardDescription className="custom-desc" data-testid="desc">Desc</CardDescription>);
		expect(screen.getByTestId('desc')).toHaveClass('custom-desc');
	});
});

describe('<CardAction />', () => {
	it('renders with default props', () => {
		render(<CardAction data-testid="action">Action button</CardAction>);
		const action = screen.getByTestId('action');
		expect(action).toBeInTheDocument();
		expect(action).toHaveAttribute('data-slot', 'card-action');
	});

	it('applies custom className', () => {
		render(<CardAction className="custom-action" data-testid="action">Action</CardAction>);
		expect(screen.getByTestId('action')).toHaveClass('custom-action');
	});
});

describe('<CardContent />', () => {
	it('renders with default props', () => {
		render(<CardContent data-testid="content">Content text</CardContent>);
		const content = screen.getByTestId('content');
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute('data-slot', 'card-content');
	});

	it('applies custom className', () => {
		render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
		expect(screen.getByTestId('content')).toHaveClass('custom-content');
	});
});

describe('<CardFooter />', () => {
	it('renders with default props', () => {
		render(<CardFooter data-testid="footer">Footer content</CardFooter>);
		const footer = screen.getByTestId('footer');
		expect(footer).toBeInTheDocument();
		expect(footer).toHaveAttribute('data-slot', 'card-footer');
	});

	it('applies custom className', () => {
		render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
		expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
	});
});

describe('Card composition', () => {
	it('renders a complete card with all subcomponents', () => {
		render(
			<Card data-testid="card">
				<CardHeader>
					<CardTitle data-testid="title">Card Title</CardTitle>
					<CardDescription data-testid="desc">Card description goes here</CardDescription>
					<CardAction data-testid="action">
						<button>Action</button>
					</CardAction>
				</CardHeader>
				<CardContent data-testid="content">
					<p>Main content of the card</p>
				</CardContent>
				<CardFooter data-testid="footer">
					<button>Save</button>
					<button>Cancel</button>
				</CardFooter>
			</Card>
		);

		expect(screen.getByTestId('card')).toBeInTheDocument();
		expect(screen.getByTestId('title')).toHaveTextContent('Card Title');
		expect(screen.getByTestId('desc')).toHaveTextContent('Card description goes here');
		expect(screen.getByTestId('action')).toBeInTheDocument();
		expect(screen.getByTestId('content')).toHaveTextContent('Main content of the card');
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});
});

