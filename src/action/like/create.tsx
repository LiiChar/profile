'use server';

import { db } from '@/db/db';
import { likes } from '@/db/tables/like';
import { and, eq, count } from 'drizzle-orm';
import { getCurrentUser } from '../auth/login';
import { addMetric } from '../metrics/addMetric';

export const createLike = async (blogId: number) => {
	try {
		const user = await getCurrentUser();
		if (!user) {
			throw new Error('Not authenticated');
		}

		const data = { userId: user.id, blogId };

		const existing = await db
			.select()
			.from(likes)
			.where(and(eq(likes.userId, data.userId), eq(likes.blogId, data.blogId)));

		if (existing.length === 0) {
			await db.insert(likes).values(data);
			await addMetric({ action: 'like', targetType: 'blog', targetId: blogId });
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
