'use server';

import { db } from '@/db/db';
import { blogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const removeBlog = async (id: number) => {
	await db.delete(blogs).where(eq(blogs.id, id));
};
