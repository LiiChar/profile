'use client';

import { createLike } from '@/action/like/create';
import { removeLike } from '@/action/like/remove';
import { LikeType } from '@/db/tables/like';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const BlogLike = ({
	likes,
	userId,
	blogId,
	size = 18,
	...attr
}: {
	likes: LikeType[];
	userId?: number;
	blogId?: number;
	size?: number;
} & HTMLAttributes<HTMLDivElement>) => {
	const [liked, setLiked] = useState(likes.some(l => l.userId === userId));
	const router = useRouter();

	useEffect(() => {
		setLiked(likes.some(l => l.userId === userId));
	}, [likes, userId]);

	const handleLike = async () => {
		if (!userId || !blogId) return;

		const isUnliking = liked;

		try {
			if (isUnliking) {
				await removeLike({ blogId, userId });
			} else {
				await createLike({ blogId, userId });
			}
			router.refresh();
		} catch (error) {
			console.error('[LIKE ERROR]', error);
			toast('Произошла ошибка при обновлении лайка');
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
