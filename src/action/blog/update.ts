'use server';

import { db } from '@/db/db';
import { blogs, BlogType } from '@/db/tables/blog';
import { eq } from 'drizzle-orm';
import translate from 'google-translate-api-x';

export const updateBlog = async (
	data: Partial<Pick<BlogType, 'id' | 'userId' | 'title' | 'content' | 'lang' | 'image'>>
) => {
	// TODO
	// if (data.authorId != data.userId) {
	if (!data.id) {
		throw Error(
			'Вы не можете изменить статью так как не был передан индетификатор'
		);
	}

	if (!data.userId) {
		throw Error(
			'Вы не можете изменить статью так как не являетесь автором или модератором'
		);
	}

	const existedBlog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, data.id!),
	});

	if (!existedBlog) {
		throw Error('не найден блог по id ' + data.id);
	}
	let resTitle = null;
	let resContent = null;

	try {
		resTitle = data.title
			? (await translate(data.title, { to: 'en' })).text
			: null;
		resContent = data.content
			? (await translate(data.content, { to: 'en' })).text
			: null;
	} catch (e) {
		if (e instanceof Error) {
			console.log('Translate error');
		}
	}
	

	const updatedBlog = await db
		.update(blogs)
		.set({
			image: data?.image ?? null,
			userId: data.userId,
			title: data.title,
			content: data.content,
			lang: {
				en: {
					content: resContent ? resContent : '',
					title: resTitle ? resTitle : '',
				},
			},
		})
		.where(eq(blogs.id, data.id))
		.returning();

	if (!updatedBlog[0]) {
		throw Error('Произошла ошибка при обновлении статьи. Попробуйте позже');
	}
};
