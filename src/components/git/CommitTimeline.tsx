
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { GitCommit, ExternalLink } from 'lucide-react';
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

const NODE_SIZE = {
	narrow: 12,
	default: 16,
};

const NODE_GAP = {
	narrow: 32,
	default: 44,
};

const generateCommitTree = (
	commits: Commit[],
	variant: CommitTreeProps['variant'] = 'vertical'
): CommitNode[] => {
	const isHorizontal = variant === 'horizontal';
	const isNarrow = variant === 'narrow';

	const gap = isNarrow ? NODE_GAP.narrow : NODE_GAP.default;
	const offset = gap / 2;

	return commits.map((commit, index) => ({
		commit,
		x: isHorizontal ? index * gap + offset : 0,
		y: isHorizontal ? offset : index * gap + offset,
	}));
};

function CommitTooltip({ commit }: { commit: Commit }) {
	const { message, author } = commit.commit;

	const date = new Intl.DateTimeFormat(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(author.date));

	return (
		<TooltipContent
			side="top"
			align="center"
			className="z-50 max-w-xs rounded-lg border bg-card p-3 shadow-lg"
		>
			<div className="break-words text-sm font-semibold text-foreground">
				{message.split('\n')[0]}
			</div>

			<div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
				<GitCommit className="size-3.5 shrink-0" />
				<span className="truncate">{author.name}</span>
				<span>·</span>
				<time dateTime={author.date}>{date}</time>
			</div>

			<a
				href={commit.html_url}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-3 block"
			>
				<Button size="sm" variant="secondary" className="w-full">
					View on GitHub
					<ExternalLink className="ml-2 size-3" />
				</Button>
			</a>
		</TooltipContent>
	);
}

export function CommitTree({
	variant = 'vertical',
	commits = [],
}: CommitTreeProps) {
	const visibleCommits = commits.slice(0, 50);

	const isHorizontal = variant === 'horizontal';
	const isNarrow = variant === 'narrow';

	const nodeSize = isNarrow
		? NODE_SIZE.narrow
		: NODE_SIZE.default;

	const gap = isNarrow
		? NODE_GAP.narrow
		: NODE_GAP.default;

	const commitNodes = generateCommitTree(visibleCommits, variant);

	if (!visibleCommits.length) return null;

	const contentSize = visibleCommits.length * gap;

	return (
		<div
			className={cn(
				'relative',
				isHorizontal
					? 'w-full min-w-0 overflow-x-auto overflow-y-hidden pb-3'
					: 'h-full overflow-y-auto overflow-x-hidden',
				isNarrow && 'max-w-xs'
			)}
		>
			<div
				className={cn(
					'relative',
					isHorizontal
						? 'h-12'
						: 'w-12'
				)}
				style={
					isHorizontal
						? { width: contentSize, minWidth: '100%' }
						: { height: contentSize }
				}
			>
				{/* Timeline Line */}
				<div
					className={cn(
						'absolute bg-border',
						isHorizontal
							? 'left-0 top-1/2 h-[2px] -translate-y-1/2 w-full'
							: 'left-1/2 top-0 h-full w-[2px] -translate-x-1/2'
					)}
				/>

				{/* Commit Nodes */}
				{commitNodes.map((node, index) => {
					const isFirst = index === 0;

					return (
						<Tooltip key={node.commit.sha}>
							<TooltipTrigger asChild>
								<button
									type="button"
									aria-label={`Commit by ${node.commit.commit.author.name}: ${node.commit.commit.message}`}
									className={cn(
										'absolute z-10 flex items-center justify-center',
										'rounded-full transition-transform duration-200',
										'hover:scale-125 focus-visible:outline-none',
										'focus-visible:ring-2 focus-visible:ring-primary',
										isHorizontal
											? 'top-1/2 -translate-x-1/2 -translate-y-1/2'
											: 'left-1/2 -translate-x-1/2 -translate-y-1/2',
										isHorizontal
											? 'size-8'
											: 'size-8'
									)}
									style={{
										left: isHorizontal ? node.x : '50%',
										top: isHorizontal ? '50%' : node.y,
									}}
								>
									<span
										className={cn(
											'rounded-full border-2 transition-colors',
											isFirst
												? 'border-primary bg-primary'
												: 'border-muted-foreground/50 bg-card hover:border-primary hover:bg-primary/20'
										)}
										style={{
											width: nodeSize,
											height: nodeSize,
										}}
									/>
								</button>
							</TooltipTrigger>

							<CommitTooltip commit={node.commit} />
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
}
