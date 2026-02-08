'use server';

import { db } from '@/db/db';
import { blogs } from '@/db/tables/blog';
import translate from 'google-translate-api-x';
import { revalidatePath } from 'next/cache';

const LANGS = ['ru', 'en'] as const;
const parseTags = (tags?: string) =>
	(tags ?? '')
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean);

export const createBlog = async (
	data: {
		title: string;
		content: string;
		userId: number;
		tags?: string;
		image?: string;
		description?: string;
	}
) => {
	if (!data.userId) {
		throw Error('User ID is required');
	}

	if (!data.title) {
		throw Error('Title is required');
	}

	if (!data.content) {
		throw Error('Content is required');
	}

	const resTitle = await translate(data.title, { to: 'en' });
	const resContent = await translate(data.content, { to: 'en' });

	const newBlog = await db
		.insert(blogs)
		.values({
			userId: data.userId,
			title: data.title,
			content: data.content,
			tags: data.tags,
			image: data.image,
			lang: {
				en: {
					content: resContent.text,
					title: resTitle.text,
				},
			},
		})
		.returning();

	if (!newBlog[0]) {
		throw Error('Error creating blog');
	}

	const blogId = newBlog[0].id;
	const tags = parseTags(data.tags);
	LANGS.forEach((lang) => {
		revalidatePath(`/${lang}`);
		revalidatePath(`/${lang}/blog`);
		revalidatePath(`/${lang}/blog/${blogId}`);
		tags.forEach((tag) => revalidatePath(`/${lang}/blog/tag/${tag}`));
	});

	return newBlog[0];
};
