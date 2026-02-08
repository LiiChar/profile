'use server';

import { db } from '@/db/db';
import { blogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const LANGS = ['ru', 'en'] as const;
const parseTags = (tags?: string | null) =>
	(tags ?? '')
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean);

export const removeBlog = async (id: number) => {
	const existing = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, id),
	});

	await db.delete(blogs).where(eq(blogs.id, id));

	const tags = parseTags(existing?.tags ?? '');
	LANGS.forEach((lang) => {
		revalidatePath(`/${lang}`);
		revalidatePath(`/${lang}/blog`);
		revalidatePath(`/${lang}/blog/${id}`);
		tags.forEach((tag) => revalidatePath(`/${lang}/blog/tag/${tag}`));
	});
};
