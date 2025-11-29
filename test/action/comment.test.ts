import { describe, it, expect, vi, afterEach } from 'vitest';
import { createComment } from '@/action/comment/create';
import { db } from '@/db/db';

vi.mock('@/db/db', () => ({
	db: {
		insert: vi.fn(),
	},
}));

const mockInsert = db.insert as any;

afterEach(() => {
	vi.clearAllMocks();
});

describe('createComment', () => {
	it('successfully creates a comment', async () => {
		mockInsert.mockReturnValue({
			values: vi.fn().mockResolvedValue(undefined),
		});

		const commentData = {
			message: 'This is a test comment',
			blogId: 1,
			userId: 123,
		};

		await expect(createComment(commentData)).resolves.toBeUndefined();
		expect(mockInsert).toHaveBeenCalledWith(expect.any(Object));
	});

	it('passes correct data to database', async () => {
		mockInsert.mockReturnValue({
			values: vi.fn().mockResolvedValue(undefined),
		});

		const commentData = {
			message: 'Comment content',
			blogId: 45,
			userId: 789,
			description: 'Optional description',
		};

		await createComment(commentData);

		expect(mockInsert).toHaveBeenCalledWith(expect.any(Object));
		// Verify that values was called with the correct data
		expect(mockInsert().values).toHaveBeenCalledWith(commentData);
	});
});
