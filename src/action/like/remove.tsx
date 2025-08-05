'use server';

import { db } from '@/db/db';
import { LikeInsert, likes } from '@/db/tables/like';
import { and, eq, count } from 'drizzle-orm';

export const removeLike = async ({ userId, blogId }: LikeInsert) => {
	try {
		await db
			.delete(likes)
			.where(and(eq(likes.userId, userId), eq(likes.blogId, blogId)));

		await db
			.select({ count: count() })
			.from(likes)
			.where(eq(likes.blogId, blogId));

		return false;
	} catch (error) {
		console.error('[REMOVE LIKE ERROR]', error);
		throw new Error('Не удалось удалить лайк');
	}
};
