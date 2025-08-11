import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { projects } from '@/db/schema';
import { ProjectUpdatePage } from '@/components/page/ProjectUpdate';

export default async function UpdateProject({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const { id } = await params;

	const project = await db.query.projects.findFirst({
		where: () => eq(projects.id, id),
		with: {
			user: true,
		},
	});

	if (!project) {
		return (
			<div className='text-center text-red-500 mt-10'>Project not found</div>
		);
	}

	return (
		<main>
			<ProjectUpdatePage project={project} />
		</main>
	);
}
