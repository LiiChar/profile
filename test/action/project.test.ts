import { describe, it, expect, vi, afterEach } from 'vitest';
import { getProjects } from '@/action/project/getProjects';
import { updateProject } from '@/action/project/update';
import { db } from '@/db/db';
import translate from 'google-translate-api-x';

vi.mock('@/db/db', () => ({
	db: {
		query: {
			projects: {
				findMany: vi.fn(),
				findFirst: vi.fn(),
			},
		},
		update: vi.fn(),
	},
}));

vi.mock('google-translate-api-x', () => ({
	default: vi.fn(),
}));

const mockFindMany = db.query.projects.findMany as any;
const mockFindFirst = db.query.projects.findFirst as any;
const mockUpdate = db.update as any;
const mockTranslate = translate as any;

afterEach(() => {
	vi.clearAllMocks();
});

describe('getProjects', () => {
	it('successfully retrieves projects', async () => {
		const mockProjects = [
			{ id: 1, title: 'Project 1', content: 'Description 1' },
			{ id: 2, title: 'Project 2', content: 'Description 2' },
		];

		mockFindMany.mockResolvedValue(mockProjects);

		const result = await getProjects();

		expect(result).toEqual(mockProjects);
		expect(mockFindMany).toHaveBeenCalled();
	});

	it('returns empty array when no projects', async () => {
		mockFindMany.mockResolvedValue([]);

		const result = await getProjects();

		expect(result).toEqual([]);
	});
});

describe('updateProject', () => {
	it('successfully updates project with translation', async () => {
		const mockExistingProject = { id: 1, userId: 123, title: 'Old Title', content: 'Old Content' };
		const mockUpdatedProject = [{ id: 1, userId: 123, title: 'New Title', content: 'New Content' }];

		mockFindFirst.mockResolvedValue(mockExistingProject);
		mockUpdate.mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockUpdatedProject),
		});

		mockTranslate
			.mockResolvedValueOnce({ text: 'Translated title' })
			.mockResolvedValueOnce({ text: 'Translated content' });

		await updateProject({
			id: 1,
			userId: 123,
			title: 'New Title',
			content: 'New Content',
		});

		expect(mockFindFirst).toHaveBeenCalled();
		expect(mockTranslate).toHaveBeenCalledWith('New Title', { to: 'en' });
	});

	it('throws error if id is missing', async () => {
		await expect(updateProject({ userId: 123, title: 'Title' })).rejects.toThrow(
			'Вы не можете изменить статью так как не был передан индетификатор'
		);
	});

	it('throws error if project not found', async () => {
		mockFindFirst.mockResolvedValue(null);

		await expect(updateProject({ id: 1, userId: 123 })).rejects.toThrow('не найден блог по id 1');
	});

	it('handles image conversion to base64', async () => {
		const mockExistingProject = { id: 1, userId: 123 };
		const mockUpdatedProject = [{ id: 1 }];

		mockFindFirst.mockResolvedValue(mockExistingProject);
		mockUpdate.mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(mockUpdatedProject),
		});

		// Mock fetch for image
		const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
			arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
			headers: new Headers({ 'content-type': 'image/png' }),
		} as Response);

		mockTranslate.mockResolvedValue({ text: 'Translated' });

		await updateProject({
			id: 1,
			userId: 123,
			image: 'http://example.com/image.png',
		});

		expect(mockFetch).toHaveBeenCalledWith('http://example.com/image.png');
		expect(mockUpdate).toHaveBeenCalled();

		mockFetch.mockRestore();
	});

	it('throws error when update fails', async () => {
		mockFindFirst.mockResolvedValue({ id: 1, userId: 123 });
		mockUpdate.mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([]),
		});

		mockTranslate.mockResolvedValue({ text: 'Translated' });

		await expect(updateProject({
			id: 1,
			userId: 123,
			title: 'Title',
		})).rejects.toThrow('Произошла ошибка при обновлении статьи. Попробуйте позже');
	});
});
