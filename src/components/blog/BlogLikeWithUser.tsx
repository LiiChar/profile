'use client';

import type { LikeType } from '@/db/tables/like';
import { BlogLike } from './BlogLike';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const BlogLikeWithUser = ({
	likes,
	blogId,
	size,
}: {
	likes: LikeType[];
	blogId: number;
	size?: number;
}) => {
	const { user } = useCurrentUser();

	return (
		<BlogLike
			likes={likes}
			currentUserId={user?.id}
			blogId={blogId}
			size={size}
		/>
	);
};
