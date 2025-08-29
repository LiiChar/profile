import { ProjectCard } from '@/components/project/ProjectCard';
import { db } from '@/db/db';
import { like } from 'drizzle-orm';

export default async function Tag({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const ilikeTagContain = `%${tag}%`;
	const tagProjects = await db.query.projects.findMany({
		where: b => like(b.tags, ilikeTagContain),
	});

	return (
		<main>
			<h1 className='my-10'>{tag}</h1>
			<div className='flex gap-4 px-2 flex-wrap 	'>
				{tagProjects &&
					Array.isArray(tagProjects) &&
					tagProjects.map(p => (
						<ProjectCard
							className='w-full px-4	flex-grow sm:px-0 sm:w-[calc(50%-12px)] md:w-[calc(33%-9px)]'
							project={p}
							key={p.id}
						/>
					))}
			</div>
		</main>
	);
}
