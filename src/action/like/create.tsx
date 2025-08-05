'use server';

import { db } from '@/db/db';
import { LikeInsert, likes } from '@/db/tables/like';
import { and, eq, count } from 'drizzle-orm';

export const createLike = async (data: LikeInsert) => {
	try {
		const existing = await db
			.select()
			.from(likes)
			.where(and(eq(likes.userId, data.userId), eq(likes.blogId, data.blogId)));

		if (existing.length === 0) {
			await db.insert(likes).values(data);
		}

		await db
			.select({ count: count() })
			.from(likes)
			.where(eq(likes.blogId, data.blogId));

		return true;
	} catch (error) {
		console.error('[CREATE LIKE ERROR]', error);
		throw new Error('Не удалось поставить лайк');
	}
};
