'use client';

import { useEffect, useState } from 'react';
import { getCommits } from '@/action/git/getCommits';
import { cn } from '@/lib/utils';

type Commit = {
	sha: string;
	html_url: string;
	commit: {
		message: string;
		author: { name: string; date: string };
	};
	parents: { sha: string }[];
};

type CommitNode = {
	commit: Commit;
	x: number;
	y: number;
};

const NodeGap = 40;

const generateCommitTree = (commits: Commit[]): CommitNode[] => {
	const commitTree: CommitNode[] = [];

	for (let i = 0; i < commits.length; i++) {
		const commit = commits[i];
		const commitNode: CommitNode = {
			commit,
			x: 0,
			y: i * NodeGap,
		};

		commitTree.push(commitNode);
	}

	return commitTree;
};

export function CommitTree() {
	const [commits, setCommits] = useState<CommitNode[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getCommits();
			setCommits(generateCommitTree(data.slice(0, 50))); // Ограничение для читаемости
		};
		fetchData();
	}, []);

	return (
		<div className='relative overflow-hidden h-full '>
			<div className='h-full w-[1px] bg-primary absolute left-2 top-0'></div>
			<div className=''>
				{commits.map((commit, i) => (
					<div
						style={{
							position: 'absolute',
							top: `${commit.y}px`,
							left: `${commit.x}px`,
						}}
						key={commit.commit.sha}
						className='group flex gap-2 '
					>
						<div
							className={cn(
								'border border-primary group-hover:bg-primary transi rounded-full transition-all w-4 h-4 aspect-square bg-background',
								i == 0 && 'bg-primary'
							)}
						></div>
						<div
							className={cn(
								'opacity-0 -mt-1 transition-all group-hover:opacity-100',
								i == 0 && 'opacity-100'
							)}
						>
							{commit.commit.commit.message}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
