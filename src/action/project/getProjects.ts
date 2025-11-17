'use server';

import { db } from '@/db/db';

export const getProjects = async () => {
	const projects = await db.query.projects.findMany();
	return projects;
};
