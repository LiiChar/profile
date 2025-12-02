'use client';

import { createLike } from '@/action/like/create';
import { removeLike } from '@/action/like/remove';
import { LikeType } from '@/db/tables/like';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const BlogLike = ({
	likes,
	currentUserId,
	blogId,
	size = 18,
	...attr
}: {
	likes: LikeType[];
	currentUserId?: number;
	blogId?: number;
	size?: number;
} & HTMLAttributes<HTMLDivElement>) => {
	const [liked, setLiked] = useState(likes.some(l => l.userId === currentUserId));

	useEffect(() => {
		setLiked(likes.some(l => l.userId === currentUserId));
	}, [likes, currentUserId]);

	const handleLike = async () => {
		if (!currentUserId || !blogId) {
			toast('Требуется авторизация');
			return;
		}

		const isUnliking = liked;

		try {
			if (isUnliking) {
				await removeLike(blogId);
			} else {
				await createLike(blogId);
			}
			setLiked(!liked);
			// router.refresh();
		} catch (error) {
			console.error('[LIKE ERROR]', error);
			toast('Произошла ошибка при обновлении лайка');
			setLiked(liked); // rollback
		}
	};

	return (
		<div
			{...attr}
			className={cn(
				'flex gap-2 text-xs bg-secondary px-[10px] py-1 rounded-md items-center cursor-pointer select-none',
				attr.className
			)}
			onClick={handleLike}
		>
			<div>{likes.length}</div>
			<Heart
				size={size}
				className={cn(
					'transition fill-transparent stroke-2 hover:stroke-primary',
					liked && 'fill-primary text-primary'
				)}
			/>
		</div>
	);
};
