import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Button } from '../ui/button';
import { GitCommit } from 'lucide-react';
import { Commit } from '@/types/commit';

type CommitNode = {
	commit: Commit;
	x: number;
	y: number;
};

type CommitTreeProps = {
	variant?: 'narrow' | 'horizontal' | 'vertical';
	commits: Commit[];
};

const generateCommitTree = (
	commits: Commit[],
	variant: string = 'vertical'
): CommitNode[] => {
	const commitTree: CommitNode[] = [];
	const nodeGap = variant === 'narrow' ? 30 : 50;
	const isHorizontal = variant === 'horizontal';

	for (let i = 0; i < commits.length; i++) {
		const commit = commits[i];
		const commitNode: CommitNode = {
			commit,
			x: isHorizontal ? i * nodeGap + 20 : 0,
			y: isHorizontal ? 20 : i * nodeGap,
		};
		commitTree.push(commitNode);
	}
	return commitTree;
};

export function CommitTree({
	variant = 'vertical',
	commits = [],
}: CommitTreeProps) {
	const commitNodes = generateCommitTree(commits.slice(0, 50), variant);

	return (
		<div
			className={cn(
				'relative h-full flex justify-center items-center w-[16px] overflow-y-hidden	',
				variant === 'narrow' && 'max-w-xs',
				variant === 'horizontal' && ' w-auto'
			)}
		>
			<div
				className={cn(
					'relative bg-secondary',
					variant === 'horizontal' ? ' h-1 w-full' : 'h-full w-[2px]',
					variant === 'narrow' && 'left-6'
				)}
			></div>

			<div className='absolute top-0 left-0 w-[16px]'>
				{commitNodes &&
					Array.isArray(commitNodes) &&
					commitNodes.map((commit, i) => (
						<Tooltip key={commit.commit.sha}>
							<TooltipTrigger asChild>
								<div
									style={{
										position: 'absolute',
										top: `${commit.y}px`,
										left: `${commit.x}px`,
									}}
								>
									<div
										className={cn(
											'rounded-full border-2 bg-secondary transition-all duration-300 hover:border-primary ',
											variant === 'narrow' ? 'h-3 w-3' : 'h-4 w-4',
											i === 0 && 'bg-primary hover:bg-primary'
										)}
									/>
								</div>
							</TooltipTrigger>

							<TooltipContent
								side={variant === 'horizontal' ? 'top' : 'left'}
								className='z-50 max-w-xs rounded-lg bg-secondary'
							>
								<div className='font-medium text-foreground text-lg'>
									{commit.commit.commit.message}
								</div>
								<div className='mt-3 text-xs text-foreground/65 flex items-center gap-1'>
									{commit.commit.commit.author.name} <GitCommit />{' '}
									{new Date(
										commit.commit.commit.author.date
									).toLocaleDateString()}
								</div>
								<a
									href={commit.commit.html_url}
									target='_blank'
									rel='noopener noreferrer'
									className='mt-2 inline-block text-xs text-center w-full text-blue-500 hover:underline'
								>
									<Button className=' w-full'>View on GitHub</Button>
								</a>
							</TooltipContent>
						</Tooltip>
					))}
			</div>
		</div>
	);
}
