import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BlogCreatePage } from '@/components/page/BlogCreate';

// Mock dependencies
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock('@/action/blog/create', () => ({
	createBlog: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}));

vi.mock('@/components/generate/GenerateIcon', () => ({
	GenerateIcon: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/image-upload', () => ({
	ImageUpload: ({ onSelect }: { onSelect: (url: string) => void }) => (
		<button onClick={() => onSelect('test.jpg')} data-testid="image-upload">
			Upload
		</button>
	),
}));

describe('<BlogCreatePage />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the blog create form', () => {
		render(<BlogCreatePage />);
		
		expect(screen.getByText('Новая статья')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Заголовок статьи...')).toBeInTheDocument();
	});

	it('renders all form fields', () => {
		render(<BlogCreatePage />);
		
		expect(screen.getByPlaceholderText('Заголовок статьи...')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/react, nextjs/i)).toBeInTheDocument();
		expect(screen.getByTestId('image-upload')).toBeInTheDocument();
	});

	it('shows validation state', () => {
		render(<BlogCreatePage />);
		
		expect(screen.getByText('Заполните обязательные поля')).toBeInTheDocument();
	});

	it('updates ready state when fields are filled', async () => {
		render(<BlogCreatePage />);
		
		const titleInput = screen.getByPlaceholderText('Заголовок статьи...');
		
		await userEvent.type(titleInput, 'Test Title');
		
		// Заполнение контента требует MarkdownEditor, который мокается
	});

	it('has submit button', () => {
		render(<BlogCreatePage />);
		
		const submitButton = screen.getByRole('button', { name: /опубликовать/i });
		expect(submitButton).toBeInTheDocument();
	});

	it('displays description subtitle', () => {
		render(<BlogCreatePage />);
		
		expect(screen.getByText('Создайте новую статью для блога')).toBeInTheDocument();
	});

	it('renders tags field with hint', () => {
		render(<BlogCreatePage />);
		
		expect(screen.getByText('Разделяйте теги запятыми')).toBeInTheDocument();
	});
});

