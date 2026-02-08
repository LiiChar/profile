'use server';

import { db } from '@/db/db';
import { CommentInsert, comments } from '@/db/tables/comment';
import { revalidatePath } from 'next/cache';

const LANGS = ['ru', 'en'] as const;

export const createComment = async (data: CommentInsert) => {
	await db.insert(comments).values(data);

	if (data.blogId) {
		LANGS.forEach((lang) => {
			revalidatePath(`/${lang}/blog/${data.blogId}`);
		});
	}
};
