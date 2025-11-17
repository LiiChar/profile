'use server';

import { db } from '@/db/db';
import { blogs } from '@/db/tables/blog';
import translate from 'google-translate-api-x';

export const createBlog = async (
	data: {
		title: string;
		content: string;
		userId: number;
		tags?: string;
		image?: string;
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

	return newBlog[0];
};
