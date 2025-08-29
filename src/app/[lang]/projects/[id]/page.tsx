import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { projects } from '@/db/schema';
import { TagList } from '@/components/tag/TagList';
import { CommitTree } from '@/components/git/CommitTimeline';
import { Button } from '@/components/ui/button';
import { GrowArrow } from '@/components/ui/grow-arrow';
import { Separator } from '@/components/ui/separator';
import { ProjectAction } from '@/components/project/ProjectAction';
import { getFieldLang, getLang } from '@/helpers/i18n';
import { Markdown } from '@/components/ui/markdown';
import { getCommits } from '@/action/git/getCommits';

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const lang = await getLang();
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

	const { repoName, createdAt, tags, author, url } = project;
	const commits = repoName ? await getCommits(repoName) : null;

	return (
		<main className='max-w-4xl mx-auto px-4 py-8'>
			{url && (
				<iframe
					className='w-full aspect-video rounded-lg border '
					src={url}
				></iframe>
			)}
			<h1 className='text-4xl font-bold my-16'>
				{getFieldLang(project, 'title', lang)}
			</h1>
			<div className='flex gap-4'>
				<div className='w-full'>
					<div className='mb-6 w-full'>
						<div className='flex justify-between items-center'>
							<p className='text-sm text-gray-500'>
								Автор: {author} • {new Date(createdAt).toLocaleDateString()}
							</p>
							{repoName && (
								<a
									href={`https://github.com/LiiChar/${repoName}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									<Button className='' variant={'secondary'}>
										Посмотреть на GitHub <GrowArrow />
									</Button>
								</a>
							)}
						</div>
					</div>

					<div className='prose prose-lg max-w-none '>
						<Markdown>{getFieldLang(project, 'content', lang)}</Markdown>
					</div>

					<div className='flex items-center gap-3 mt-10'>
						<div>
							{tags && (
								<TagList
									className=''
									linkBase='/projects/tag/'
									tags={tags}
									prefix={'#'}
									variant='default'
								/>
							)}
						</div>
						<Separator className='' />
						<div>
							<ProjectAction project={project} />
						</div>
					</div>
				</div>
				{commits && (
					<div>
						<CommitTree commits={commits} />
					</div>
				)}
			</div>
		</main>
	);
}
