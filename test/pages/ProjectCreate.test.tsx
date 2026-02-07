import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProjectCreatePage } from '@/components/page/ProjectCreate';

// Mock dependencies
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock('@/action/project/create', () => ({
	createProject: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock('next/image', () => ({
	default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('@/helpers/url', () => ({
	validateUrl: (url: string) => url?.startsWith('http'),
}));

describe('<ProjectCreatePage />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the project create form', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByText('Новый проект')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Название проекта...')).toBeInTheDocument();
	});

	it('renders all form fields', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Название проекта...')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('https://example.com/image.jpg')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Ваше имя')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('username/repo-name')).toBeInTheDocument();
	});

	it('shows validation state', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByText('Заполните обязательные поля')).toBeInTheDocument();
	});

	it('has submit button', () => {
		render(<ProjectCreatePage />);
		
		const submitButton = screen.getByRole('button', { name: /опубликовать/i });
		expect(submitButton).toBeInTheDocument();
	});

	it('displays description subtitle', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByText('Добавьте новый проект в портфолио')).toBeInTheDocument();
	});

	it('renders tags field with hint', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByText('Разделяйте теги запятыми')).toBeInTheDocument();
	});

	it('shows labels for all fields', () => {
		render(<ProjectCreatePage />);
		
		expect(screen.getByText('Ссылка на проект')).toBeInTheDocument();
		expect(screen.getByText('Обложка проекта')).toBeInTheDocument();
		expect(screen.getByText('Автор')).toBeInTheDocument();
		expect(screen.getByText('Репозиторий GitHub')).toBeInTheDocument();
		expect(screen.getByText('Краткое описание')).toBeInTheDocument();
		expect(screen.getByText('Полное описание проекта')).toBeInTheDocument();
		expect(screen.getByText('Технологии и теги')).toBeInTheDocument();
	});

	it('prefills author field with default value', () => {
		render(<ProjectCreatePage />);
		
		const authorInput = screen.getByPlaceholderText('Ваше имя');
		expect(authorInput).toHaveValue('LiiChar');
	});

	it('handles URL input', async () => {
		render(<ProjectCreatePage />);
		
		const urlInput = screen.getByPlaceholderText('https://example.com');
		await userEvent.type(urlInput, 'https://myproject.com');
		
		expect(urlInput).toHaveValue('https://myproject.com');
	});

	it('handles title input', async () => {
		render(<ProjectCreatePage />);
		
		const titleInput = screen.getByPlaceholderText('Название проекта...');
		await userEvent.type(titleInput, 'My Awesome Project');
		
		expect(titleInput).toHaveValue('My Awesome Project');
	});
});

