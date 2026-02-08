'use client';

import type { CommentWithUser } from '@/types/comments';
import { HTMLAttributes } from 'react';
import { CommentsList } from './CommentsList';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const CommentsListWithUser = ({
	comments,
	blogId,
	...attr
}: {
	comments: CommentWithUser[];
	blogId: number;
} & HTMLAttributes<HTMLDivElement>) => {
	const { user } = useCurrentUser();

	return (
		<CommentsList
			{...attr}
			comments={comments}
			blogId={blogId}
			currentUserId={user?.id}
		/>
	);
};
