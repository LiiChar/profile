'use server';

import { db } from '@/db/db';
import { likes } from '@/db/tables/like';
import { and, eq, count } from 'drizzle-orm';
import { getCurrentUser } from '../auth/login';

export const removeLike = async (blogId: number) => {
	try {
		const user = await getCurrentUser();
		if (!user) {
			throw new Error('Not authenticated');
		}

		await db
			.delete(likes)
			.where(and(eq(likes.userId, user.id), eq(likes.blogId, blogId)));

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
