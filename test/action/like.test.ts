import { describe, it, expect, vi, afterEach } from 'vitest';
import { createLike } from '@/action/like/create';
import { removeLike } from '@/action/like/remove';
import { db } from '@/db/db';

vi.mock('@/db/db', () => ({
	db: {
		select: vi.fn(),
		from: vi.fn(),
		where: vi.fn(),
		insert: vi.fn(),
		delete: vi.fn(),
	},
}));

const mockSelect = db.select as any;
const mockDelete = db.delete as any;
const mockInsert = db.insert as any;

afterEach(() => {
	vi.clearAllMocks();
});

describe('createLike', () => {
	it('successfully creates a like when it does not exist', async () => {
		mockSelect
			.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([]),
				}),
			});

		mockInsert.mockReturnValue({
			values: vi.fn().mockResolvedValue(undefined),
		});

		const result = await createLike({
			userId: 123,
			blogId: 456,
		});

		expect(result).toBe(true);
		expect(mockSelect).toHaveBeenCalled();
		expect(mockInsert).toHaveBeenCalledWith(expect.any(Object));
	});

	it('does not create duplicate like', async () => {
		mockSelect
			.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([{
						userId: 123,
						blogId: 456,
					}]),
				}),
			});

		const result = await createLike({
			userId: 123,
			blogId: 456,
		});

		expect(result).toBe(true);
		expect(mockInsert).not.toHaveBeenCalled();
	});

	it('throws error on database error', async () => {
		mockSelect
			.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockRejectedValue(new Error('DB error')),
				}),
			});

		await expect(createLike({
			userId: 123,
			blogId: 456,
		})).rejects.toThrow('Не удалось поставить лайк');
	});
});

describe('removeLike', () => {
	it('successfully removes a like', async () => {
		mockDelete.mockReturnValue({
			where: vi.fn().mockResolvedValue(undefined),
		});

		const result = await removeLike({
			userId: 123,
			blogId: 456,
		});

		expect(result).toBe(false);
		expect(mockDelete).toHaveBeenCalledWith(expect.any(Object));
	});

	it('throws error on database error', async () => {
		mockDelete.mockReturnValue({
			where: vi.fn().mockRejectedValue(new Error('DB error')),
		});

		await expect(removeLike({
			userId: 123,
			blogId: 456,
		})).rejects.toThrow('Не удалось удалить лайк');
	});
});
