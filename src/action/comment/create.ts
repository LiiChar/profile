'use server';

import { db } from '@/db/db';
import { CommentInsert, comments } from '@/db/tables/comment';

export const createComment = async (data: CommentInsert) => {
	await db.insert(comments).values(data);
};
