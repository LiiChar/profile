'use server';

import { db } from '@/db/db';
import { projects } from '@/db/tables/project';
import translate from 'google-translate-api-x';

export const createProject = async (
	data: {
		title: string;
		content: string;
		userId: number;
		image?: string;
		author?: string;
		repoName?: string;
		url?: string;
		description?: string;
		tags?: string;
		gallery?: any;
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
	const resDescription = data.description
		? await translate(data.description, { to: 'en' })
		: null;

	const newProject = await db
		.insert(projects)
		.values({
			userId: data.userId,
			title: data.title,
			content: data.content,
			image: data.image,
			author: data.author || 'LiiChar',
			repoName: data.repoName,
			url: data.url,
			description: data.description,
			tags: data.tags,
			gallery: data.gallery,
			lang: {
				en: {
					content: resContent.text,
					title: resTitle.text,
					...(resDescription && { tags: resDescription.text }),
				},
			},
		})
		.returning();

	if (!newProject[0]) {
		throw Error('Error creating project');
	}

	return newProject[0];
};
