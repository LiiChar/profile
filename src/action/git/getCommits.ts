'use server';

import { Commit } from '@/types/commit';

export const getCommits = async (repo: string): Promise<Commit[]> => {
	const res = await fetch(
		`https://api.github.com/repos/LiiChar/${repo}/commits`
	);
	return await res.json();
};
