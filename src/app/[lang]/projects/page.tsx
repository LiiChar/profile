import { db } from '@/db/db';
import { ProjectList } from '@/components/project/ProjectList';
import { Text } from '@/components/ui/text-server';

export default async function Projects() {
	const projects = await db.query.projects.findMany();
	return (
		<main className='px-4'>
			<h1 className={'py-18 text-6xl'}>
				<Text text={'page.project.title'} />
			</h1>
			<ProjectList
				className=''
				filter={true}
				projects={projects}
				variant='column-2'
			/>
		</main>
	);
}
