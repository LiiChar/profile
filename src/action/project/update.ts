'use server';

import { db } from '@/db/db';
import { projects, ProjectType } from '@/db/tables/project';
import { eq } from 'drizzle-orm';
import translate from 'google-translate-api-x';
// import translate from 'google-translate-api-x';

export const updateProject = async (
	data: Partial<
		Pick<ProjectType, 'id' | 'userId' | 'title' | 'content' | 'image' | 'description'>
	>
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

	if (data.image) {
		const fetchData = await fetch(data.image);
		const buffer = await fetchData.arrayBuffer();
		const stringifiedBuffer = Buffer.from(buffer).toString('base64');
		const contentType = fetchData.headers.get('content-type');
		const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`;
		data.image = imageBase64;
	}

	const existedBlog = await db.query.projects.findFirst({
		where: () => eq(projects.id, data.id!),
	});

	if (!existedBlog) {
		throw Error('не найден блог по id ' + data.id);
	}

	const resTitle = data.title
		? await translate(data.title, { to: 'en' })
		: null;
	const resContent = data.content
		? await translate(data.content, { to: 'en' })
		: null;
			const resDescription = data.description
				? await translate(data.description, { to: 'en' })
				: null;

	const updatedBlog = await db
		.update(projects)
		.set({
			...data,
			userId: data.userId,
			title: data.title,
			content: data.content,
			lang: {
				en: {
					content: resContent ? resContent.text : '',
					title: resTitle ? resTitle.text : '',
					description: resDescription ? resDescription.text : '',
				},
			},
		})
		.where(eq(projects.id, data.id))
		.returning();

	if (!updatedBlog[0]) {
		throw Error('Произошла ошибка при обновлении статьи. Попробуйте позже');
	}
};
