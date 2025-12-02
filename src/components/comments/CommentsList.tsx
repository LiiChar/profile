import { CommentWithUser } from '@/types/comments';
import { CommentsCard } from './CommentsCard';
import { CommentTextarea } from './CommentsTextarea';
import { HTMLAttributes } from 'react';

export const CommentsList = ({
	comments,
	blogId,
	currentUserId,
	...attr
}: {
	comments: CommentWithUser[];
	blogId: number;
	currentUserId?: number;
} & HTMLAttributes<HTMLDivElement>) => {
	return (
		<div {...attr}>
			{currentUserId && <CommentTextarea blogyId={blogId} userId={currentUserId} />}
			<div className='flex flex-col gap-4 mt-3'>
				{comments &&
					Array.isArray(comments) &&
					comments.map(c => <CommentsCard key={c.id} comment={c} />)}
				{comments.length == 0 && (
					<div>Тут пусто, но ты можешь это исправить</div>
				)}
			</div>
		</div>
	);
};
