import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { projects } from '@/db/schema';
import { TagList } from '@/components/tag/TagList';
import { CommitTree } from '@/components/git/CommitTimeline';
import { Button } from '@/components/ui/button';
import { GrowArrow } from '@/components/ui/grow-arrow';
import { Separator } from '@/components/ui/separator';
import { ProjectAction } from '@/components/project/ProjectAction';
import { getFieldLang } from '@/helpers/i18n';
import { Markdown } from '@/components/ui/markdown';
import { getCommits } from '@/action/git/getCommits';
import { BackwardLink } from '@/components/ui/backward-link';
import { ContentMetrics } from '@/components/metrics/ContentMetrics';
import { addMetric } from '@/action/metrics/addMetric';
import { getCurrentUser } from '@/action/auth/login';
import { isAdmin } from '@/helpers/user';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lang } from '@/types/i18n';

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ id: number, lang: Lang }>;
}) {
	const { id, lang } = await params;
	

	const project = await db.query.projects.findFirst({
		where: () => eq(projects.id, id),
		with: {
			user: true,
		},
	});

	const currentUser = await getCurrentUser();

	
	await addMetric({ action: 'view', targetType: 'project', targetId: id });

	if (!project) {
		return (
			<div className='text-center text-red-500 mt-10'>Project not found</div>
		);
	}

	

	const { repoName, createdAt, tags, author, url, image } = project;
	const commits = repoName ? await getCommits(repoName) : null;

	const showImage = !!image;

	return (
		<main className='max-w-3xl mx-auto my-8 px-4 relative'>
			<BackwardLink href={'/projects'} />
				{url && (
					<iframe
						className='w-full mb-4 aspect-video rounded-lg border '
						src={url}
					></iframe>
				)}
			<Card className='relative gap-0 pt-0'>
				<CardHeader
					className={cn(
						'p-0 relative mb-3 flex justify-center items-center',
						showImage ? '' : 'flex-col'
					)}
				>
					<div className='relative'>
						{showImage && (
							<div className=''>
								<Image
									fill={true}
									src={image}
									alt={`Обложка для ${getFieldLang(project, 'title', lang)}`}
									className='w-full opacity-70 h-auto rounded-lg z-1 shadow-md object-cover'
								/>
							</div>
						)}
						<h1
							className={cn(
								'text-4xl font-bold px-16	 relative z-[2]',
								showImage ? ' my-26' : 'my-14 pb-12'
							)}
						>
							{getFieldLang(project, 'title', lang)}
						</h1>
						<div
							className={cn(
								'mb-6 absolute bottom-0 left-0 w-full px-2 py-2  z-[2]',
								showImage ? 'px-2 mb-0' : ''
							)}
						>
							<div className='flex justify-between items-center'>
								<p className='text-sm text-card-foreground'>
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
					</div>
				</CardHeader>
				<CardContent className='flex gap-4 px-4 sm:px-6 lg:px-8'>
					<div className='w-full'>
						<div className='prose prose-lg max-w-none markdrow-content '>
							<Markdown>{getFieldLang(project, 'content', lang)}</Markdown>
						</div>

						<div className='flex items-center gap-3 mt-10'>
							{tags && (
								<div className='flex items-center min-w-[90%] w-full text-sm mt-auto'>
									<TagList
										className='flex-wrap w-full'
										linkBase='/projects/tag/'
										tags={tags}
										prefix={'#'}
										variant='default'
									/>
									<Separator className='max-w-4 mx-2' />
									<ContentMetrics contentId={project.id} type='project' />
								</div>
							)}
							<Separator className='w-auto min-w-4' />
							{isAdmin(currentUser) && (
								<div>
									<ProjectAction project={project} />
								</div>
							)}
						</div>
					</div>
					{commits && (
						<div>
							<CommitTree commits={commits} />
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}
