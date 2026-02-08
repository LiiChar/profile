'use server';

import { db } from '@/db/db';
import { projects, ProjectType } from '@/db/tables/project';
import translate from 'google-translate-api-x';
import { revalidatePath } from 'next/cache';

const LANGS = ['ru', 'en'] as const;

export const createProject = async (
	data: Pick<ProjectType, 'userId' | 'title' | 'content' | 'image'>
) => {
	if (!data.userId) {
		throw Error('Необходимо указать пользователя');
	}

	if (!data.title) {
		throw Error('Необходимо указать заголовок');
	}

	if (!data.content) {
		throw Error('Необходимо указать содержание');
	}

	if (data.image) {
		const fetchData = await fetch(data.image);
		const buffer = await fetchData.arrayBuffer();
		const stringifiedBuffer = Buffer.from(buffer).toString('base64');
		const contentType = fetchData.headers.get('content-type');
		const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`;
		data.image = imageBase64;
	}

	const resTitle = await translate(data.title, { to: 'en' });
	const resContent = await translate(data.content, { to: 'en' });

	const newProject = await db
		.insert(projects)
		.values({
			userId: data.userId,
			title: data.title,
			content: data.content,
			image: data.image,
			lang: {
				en: {
					content: resContent.text,
					title: resTitle.text,
				},
			},
		})
		.returning({ id: projects.id });

	if (!newProject[0]) {
		throw Error('Произошла ошибка при создании проекта. Попробуйте позже');
	}

	const projectId = newProject[0].id;
	LANGS.forEach((lang) => {
		revalidatePath(`/${lang}`);
		revalidatePath(`/${lang}/projects`);
		revalidatePath(`/${lang}/projects/${projectId}`);
	});

	return newProject[0];
};
