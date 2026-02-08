'use client';

import type { CommentWithUser } from '@/types/comments';
import { CommentCardAnimation } from '../animation/CommentCard';
import { Markdown } from '../ui/markdown';
import { Heart } from 'lucide-react';
import { getTimeAgo } from '@/helpers/date';

export const CommentsCard = ({ comment }: { comment: CommentWithUser }) => {
	return (
		<CommentCardAnimation key={comment.id}>
			<div className='w-full'>
				<div className='bg-transparent px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-all dark:shadow-[0_2px_10px_rgba(81,81,81,0.6),_0_0_1px_rgba(255,255,255,0.05)]'>
					<div className='mb-1'>
						<div className='font-semibold text-sm'>{comment.user.name}</div>
					</div>

					<div className='text-sm leading-relaxed markdown'>
						<div>
							<Markdown>{comment.message}</Markdown>
						</div>
						
					</div>
				</div>

				<div className='flex justify-between mt-1 ml-0 w-full items-center'>
					<div className='flex gap-1 items-center justify-between w-full text-xs text-muted-foreground'>
						<div className='text-[10px] text-muted-foreground'>
							{getTimeAgo(comment.updatedAt)}
						</div>
						<Heart size={18} />
					</div>
				</div>
			</div>
		</CommentCardAnimation>
	);
};
