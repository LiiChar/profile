import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCommits } from '@/action/git/getCommits';
import { Commit } from '@/types/commit';

vi.spyOn(global, 'fetch').mockImplementation(vi.fn());

afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
});

describe('getCommits', () => {
	it('successfully fetches commits from GitHub API', async () => {
		const mockCommits: Commit[] = [
			{
				sha: 'abc123',
				html_url: 'https://github.com/LiiChar/repo/commit/abc123',
				commit: {
					message: 'Initial commit',
					author: { name: 'Test User', date: '2023-01-01T00:00:00Z' },
				},
				parents: [],
			},
		];

		const mockFetch = global.fetch as any;
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockCommits),
		});

		const result = await getCommits('test-repo');

		expect(result).toEqual(mockCommits);
		expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/repos/LiiChar/test-repo/commits');
	});

	it('returns empty array when no commits', async () => {
		const mockFetch = global.fetch as any;
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve([]),
		});

		const result = await getCommits('empty-repo');

		expect(result).toEqual([]);
	});

	it('throws error when fetch fails', async () => {
		const mockFetch = global.fetch as any;
		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(getCommits('test-repo')).rejects.toThrow();
	});
});
