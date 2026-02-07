import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimationProvider } from '@/stores/animation/AnimationProvider';

describe('<AnimationProvider />', () => {
	it('renders children', () => {
		render(
			<AnimationProvider>
				<div data-testid="child">Child content</div>
			</AnimationProvider>
		);
		
		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});

	it('renders without children', () => {
		render(<AnimationProvider />);
		// Should not throw
	});

	it('renders multiple children', () => {
		render(
			<AnimationProvider>
				<div data-testid="child1">First</div>
				<div data-testid="child2">Second</div>
			</AnimationProvider>
		);
		
		expect(screen.getByTestId('child1')).toBeInTheDocument();
		expect(screen.getByTestId('child2')).toBeInTheDocument();
	});

	it('passes through children without modification', () => {
		const TestComponent = () => <span data-testid="test">Test</span>;
		
		render(
			<AnimationProvider>
				<TestComponent />
			</AnimationProvider>
		);
		
		expect(screen.getByTestId('test')).toBeInTheDocument();
	});
});

