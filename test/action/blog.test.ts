import { describe, it, expect, vi, afterEach } from 'vitest';
import { createBlog } from '@/action/blog/create';
import { removeBlog } from '@/action/blog/remove';
import { updateBlog } from '@/action/blog/update';
import { db } from '@/db/db';
import translate from 'google-translate-api-x';

// Мокаем db и translate
vi.mock('@/db/db', () => ({
	db: {
		insert: vi.fn(),
		delete: vi.fn(),
		update: vi.fn(),
		query: {
			blogs: {
				findFirst: vi.fn(),
			},
		},
	},
}));

vi.mock('google-translate-api-x', () => ({
	default: vi.fn(),
}));

const mockInsert = db.insert as any;
const mockTranslate = translate as any;

afterEach(() => {
	vi.clearAllMocks();
});

describe('createBlog', () => {
	it('successfully creates a blog with translation', async () => {
		const mockInsertedData = [{
			id: 1,
			userId: 123,
			title: 'Тестовая статья',
			content: 'Содержимое статьи',
			tags: 'тест',
			image: 'image.jpg',
			lang: {
				en: {
					content: 'Translated content',
					title: 'Translated title',
				},
			},
		}];

		mockInsert.mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockInsertedData),
		});

		mockTranslate
			.mockResolvedValueOnce({ text: 'Translated title' })
			.mockResolvedValueOnce({ text: 'Translated content' });

		const result = await createBlog({
			title: 'Тестовая статья',
			content: 'Содержимое статьи',
			userId: 123,
			tags: 'тест',
			image: 'image.jpg',
		});

		expect(result).toEqual(mockInsertedData[0]);
		expect(mockTranslate).toHaveBeenCalledWith('Тестовая статья', { to: 'en' });
		expect(mockTranslate).toHaveBeenCalledWith('Содержимое статьи', { to: 'en' });
		expect(mockInsert).toHaveBeenCalledWith(expect.any(Object));
	});

	it('throws error if userId is missing', async () => {
		await expect(createBlog({
			title: 'Title',
			content: 'Content',
			userId: 0,
		})).rejects.toThrow('User ID is required');
	});

	it('throws error if title is missing', async () => {
		await expect(createBlog({
			title: '',
			content: 'Content',
			userId: 123,
		})).rejects.toThrow('Title is required');
	});

	it('throws error if content is missing', async () => {
		await expect(createBlog({
			title: 'Title',
			content: '',
			userId: 123,
		})).rejects.toThrow('Content is required');
	});

	it('throws error if insert fails', async () => {
		mockInsert.mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([]),
		});

		mockTranslate
			.mockResolvedValueOnce({ text: 'Translated title' })
			.mockResolvedValueOnce({ text: 'Translated content' });

		await expect(createBlog({
			title: 'Title',
			content: 'Content',
			userId: 123,
		})).rejects.toThrow('Error creating blog');
	});

	it('handles optional fields', async () => {
		const mockInsertedData = [{
			id: 1,
			userId: 123,
			title: 'Тестовая статья',
			content: 'Содержимое статьи',
			tags: null,
			image: null,
			lang: {
				en: {
					content: 'Translated content',
					title: 'Translated title',
				},
			},
		}];

		mockInsert.mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockInsertedData),
		});

		mockTranslate
			.mockResolvedValueOnce({ text: 'Translated title' })
			.mockResolvedValueOnce({ text: 'Translated content' });

		const result = await createBlog({
			title: 'Тестовая статья',
			content: 'Содержимое статьи',
			userId: 123,
		});

		expect(result).toEqual(mockInsertedData[0]);
	});
});

describe('removeBlog', () => {
	it('successfully removes a blog', async () => {
		const mockDelete = db.delete as any;
		mockDelete.mockReturnValue({
			where: vi.fn().mockResolvedValue(undefined),
		});

		await expect(removeBlog(1)).resolves.toBeUndefined();
		expect(mockDelete).toHaveBeenCalledWith(expect.any(Object));
	});
});

describe('updateBlog', () => {
	it('successfully updates a blog', async () => {
		const mockUpdate = db.update as any;
		const mockFindFirst = db.query.blogs.findFirst as any;
		const mockUpdatedData = [{
			id: 1,
			userId: 123,
			title: 'Updated Title',
			content: 'Updated Content',
			lang: {
				en: {
					content: 'Translated content',
					title: 'Translated title',
				},
			},
		}];

		mockFindFirst.mockResolvedValue({
			id: 1,
			userId: 123,
		});

		mockUpdate.mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockUpdatedData),
		});

		mockTranslate
			.mockResolvedValueOnce({ text: 'Translated title' })
			.mockResolvedValueOnce({ text: 'Translated content' });

		await updateBlog({
			id: 1,
			userId: 123,
			title: 'Updated Title',
			content: 'Updated Content',
		});

		expect(mockFindFirst).toHaveBeenCalled();
		expect(mockTranslate).toHaveBeenCalledWith('Updated Title', { to: 'en' });
		expect(mockTranslate).toHaveBeenCalledWith('Updated Content', { to: 'en' });
	});

	it('throws error if id is missing', async () => {
		await expect(updateBlog({ userId: 123, title: 'Title' })).rejects.toThrow(
			'Вы не можете изменить статью так как не был передан индетификатор'
		);
	});

	it('throws error if userId is missing', async () => {
		await expect(updateBlog({ id: 1, title: 'Title' })).rejects.toThrow(
			'Вы не можете изменить статью так как не являетесь автором или модератором'
		);
	});

	it('throws error if blog not found', async () => {
		const mockFindFirst = db.query.blogs.findFirst as any;
		mockFindFirst.mockResolvedValue(null);

		await expect(updateBlog({ id: 1, userId: 123 })).rejects.toThrow('не найден блог по id 1');
	});

	it('handles translation errors gracefully', async () => {
		const mockUpdate = db.update as any;
		const mockFindFirst = db.query.blogs.findFirst as any;
		const mockUpdatedData = [{
			id: 1,
			userId: 123,
			title: 'Updated Title',
			content: 'Updated Content',
			lang: {
				en: {
					content: '',
					title: '',
				},
			},
		}];

		mockFindFirst.mockResolvedValue({
			id: 1,
			userId: 123,
		});

		mockUpdate.mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockUpdatedData),
		});

		mockTranslate.mockRejectedValueOnce(new Error('Translation failed'));

		await updateBlog({
			id: 1,
			userId: 123,
			title: 'Updated Title',
			content: 'Updated Content',
		});

		// Should still update with empty translations
		expect(mockUpdate).toHaveBeenCalled();
	});
});
