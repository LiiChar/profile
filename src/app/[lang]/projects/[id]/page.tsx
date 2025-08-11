import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { projects } from '@/db/schema';
import Image from 'next/image';
import { TagList } from '@/components/tag/TagList';
import { CommitTree } from '@/components/git/CommitTimeline';
import { Button } from '@/components/ui/button';
import { GrowArrow } from '@/components/ui/grow-arrow';
import { Separator } from '@/components/ui/separator';
import { ProjectAction } from '@/components/project/ProjectAction';
import { getFieldLang, getLang } from '@/helpers/i18n';
import { Markdown } from '@/components/ui/markdown';

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

	const { title, image, repoName, createdAt, tags, author, url } = project;

	return (
		<main className='max-w-4xl mx-auto px-4 py-8'>
			{url && (
				<iframe
					className='w-full aspect-video rounded-lg border '
					src={url}
				></iframe>
			)}
			<h1 className='text-4xl font-bold my-12'>
				{getFieldLang(project, 'title', lang)}
			</h1>
			<div className='flex gap-4'>
				<div>
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

					{image && (
						<div className='mb-6'>
							<Image
								fill={true}
								src={image}
								alt={title}
								className='w-full max-h-[400px] object-cover rounded-lg shadow'
							/>
						</div>
					)}

					<div className='prose prose-lg max-w-none '>
						<Markdown>{getFieldLang(project, 'content', lang)}</Markdown>
					</div>

					{/* Опционально: если есть репозиторий — показываем таймлайн */}
					{/*repoName && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">История коммитов</h2>
                    <CommitTimeline repo={repoName} />
                </div>
            )*/}
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
				<div className='w-[200px]'>
					<CommitTree />
				</div>
			</div>
		</main>
	);
}
