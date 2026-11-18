
import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';

import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

import { db } from '@/db/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { locales } from '@/const/i18n';
import { SITE_URL } from '@/const/url';

import { getFieldLang } from '@/helpers/i18n';
import { getCommits } from '@/action/git/getCommits';

import { Lang } from '@/types/i18n';

import { TagList } from '@/components/tag/TagList';
import { CommitTree } from '@/components/git/CommitTimeline';
import { ContentMetrics } from '@/components/metrics/ContentMetrics';
import { MetricTracker } from '@/components/metrics/MetricTracker';
import { ContentMarkdown } from '@/components/text/ContentMarkdown';
import { ProjectAdminActions } from '@/components/project/ProjectAdminActions';

import { BackwardLink } from '@/components/ui/backward-link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const revalidate = 3600;

const getProject = cache(async (id: number) => {
	return db.query.projects.findFirst({
		where: eq(projects.id, id),
		with: {
			user: true,
		},
	});
});

export async function generateStaticParams() {
	const items = await db.query.projects.findMany({
		columns: {
			id: true,
		},
	});

	return locales.flatMap(lang =>
		items.map(({ id }) => ({
			lang,
			id: String(id),
		}))
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string; lang: Lang }>;
}): Promise<Metadata> {
	const { id, lang } = await params;
	const projectId = Number(id);

	if (!Number.isSafeInteger(projectId) || projectId <= 0) {
		return {
			title: 'Project Not Found',
		};
	}

	const project = await getProject(projectId);

	if (!project) {
		return {
			title: 'Project Not Found',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const title = getFieldLang(project, 'title', lang);
	const description = (
		getFieldLang(project, 'description', lang) || title
	).slice(0, 160);

	const canonical = `${SITE_URL}/${lang}/projects/${projectId}`;

	return {
		title: `${title} - Portfolio | Maksim Ivanov`,
		description,
		keywords: [
			'project',
			'portfolio',
			title,
			'Maksim Ivanov',
			'Frontend Developer',
		],
		alternates: {
			canonical,
		},
		openGraph: {
			title: `${title} - Maksim Ivanov Portfolio`,
			description,
			url: canonical,
			siteName: 'Maksim Ivanov Portfolio',
			locale: lang === 'en' ? 'en_US' : 'ru_RU',
			type: 'article',
			publishedTime: new Date(project.createdAt).toISOString(),
			authors: [project.author],
			images: project.image
				? [
						{
							url: project.image,
							alt: title,
						},
					]
				: undefined,
		},
		twitter: {
			card: project.image ? 'summary_large_image' : 'summary',
			title,
			description,
			images: project.image ? [project.image] : undefined,
		},
	};
}

type ProjectPageProps = {
	params: Promise<{
		id: string;
		lang: Lang;
	}>;
};

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const { id, lang } = await params;
	const projectId = Number(id);

	if (!Number.isSafeInteger(projectId) || projectId <= 0) {
		notFound();
	}

	const project = await getProject(projectId);

	if (!project) {
		notFound();
	}

	const {
		repoName,
		createdAt,
		tags,
		author,
		url,
    image,
		gallery
	} = project;

	const title = getFieldLang(project, 'title', lang);
	const hasImage = Boolean(image);

	const isRu = lang === 'ru';

	const commits = repoName
		? await getCommits(repoName).catch(() => null)
		: null;

	const formattedDate = new Intl.DateTimeFormat(
		isRu ? 'ru-RU' : 'en-US',
		{
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}
	).format(new Date(createdAt));

	const githubUrl = repoName
		? `https://github.com/LiiChar/${encodeURIComponent(repoName)}`
		: null;

	return (
		<main className="relative">
			<MetricTracker
				action="view"
				targetType="project"
				targetId={projectId}
			/>

			<div className="site-container mx-auto max-w-4xl px-4 py-10 sm:py-14">
				{/* Navigation */}
				<div className="mb-10">
					<BackwardLink href={`/${lang}/projects`} />
				</div>

				{/* Header */}
				<header className="mb-8">
					<div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--site-subtle)]">
						<span>
							{isRu ? 'Проект' : 'Project'}
						</span>

						<span
							aria-hidden="true"
							className="size-1 rounded-full bg-[var(--site-accent)]/60"
						/>

						<time dateTime={new Date(createdAt).toISOString()}>
							{formattedDate}
						</time>

						<span
							aria-hidden="true"
							className="size-1 rounded-full bg-[var(--site-accent)]/60"
						/>

						<span>{author}</span>
					</div>

					<h1 className="py-12">
						{title}
					</h1>

				</header>

				{/* Cover */}
				{hasImage && !gallery && (
					<div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-lg bg-[var(--site-border)] sm:aspect-video">
						<Image
							fill
							src={image!}
							alt={title}
							sizes="(max-width: 768px) 100vw, 896px"
							priority
							className="object-cover"
						/>
					</div>
        )}

    {gallery && (
          <Carousel className="w-full">
               <CarouselContent className="-ml-1 ">
                 {gallery!.split("|").map((g, index) => (
                   <CarouselItem key={index} className="px-2">
                     <div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-lg bg-[var(--site-border)] sm:aspect-video">
          						<Image
          							fill
          							src={g!}
          							alt={title + " - изображение " + index + 1}
          							sizes="(max-width: 768px) 100vw, 896px"
          							priority
          							className="object-cover"
          						/>
          					</div>
                   </CarouselItem>
                 ))}
               </CarouselContent>
               <CarouselPrevious />
               <CarouselNext />
             </Carousel>

)}

				{/* Project links */}
				{(url || githubUrl) && (
					<div className="mb-10 flex flex-wrap items-center gap-3">
						{url && (
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 rounded-md bg-[var(--site-foreground)] px-4 py-2.5 text-sm font-medium text-[var(--site-background)] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] focus-visible:ring-offset-2"
							>
								{isRu ? 'Открыть проект' : 'Visit website'}

								<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</a>
						)}

						{githubUrl && (
							<a
								href={githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 rounded-md border border-[var(--site-border)] px-4 py-2.5 text-sm font-medium text-[var(--site-foreground)] transition-colors hover:border-[var(--site-accent)] hover:text-[var(--site-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] focus-visible:ring-offset-2"
							>
								<Github className="size-4" />
								GitHub
								<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</a>
						)}
					</div>
				)}

				{/* Content */}
				<article className="min-w-0">
					<div className="prose prose-lg max-w-none markdrow-content">
						<ContentMarkdown
							data={project}
							field="content"
						/>
					</div>
				</article>

				{/* Live Preview */}
				{url && (
					<section className="mt-14">
						<div className="mb-5 flex items-center justify-between gap-4">
							<div>
								<p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--site-subtle)]">
									{isRu ? 'В действии' : 'In action'}
								</p>

								<h2 className="text-xl font-semibold tracking-tight text-[var(--site-foreground)] sm:text-2xl">
									{isRu ? 'Предпросмотр' : 'Live preview'}
								</h2>
							</div>

							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[var(--site-muted)] transition-colors hover:text-[var(--site-accent)]"
							>
								{isRu ? 'Открыть отдельно' : 'Open separately'}
								<ExternalLink className="size-3.5" />
							</a>
						</div>

						<div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--site-border)] bg-[var(--site-border)]">
							<iframe
								src={url}
								title={`${title} — live preview`}
								loading="lazy"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
								className="absolute inset-0 size-full border-0"
							/>
						</div>
					</section>
				)}

				{/* Footer */}
				<footer className="mt-12  pt-6">
					<div className="flex flex-col gap-5">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3  text-[var(--site-muted)]">
								<span>
									{isRu ? 'Автор' : 'Author'}:
								</span>

								<span className="font-medium text-[var(--site-foreground)]">
									{author}
								</span>
							</div>

							<div className="flex shrink-0 items-center gap-3">
								<ContentMetrics
									contentId={project.id}
									type="project"
								/>

								<ProjectAdminActions
									projectId={project.id}
									lang={lang}
								/>
							</div>
						</div>
          </div>


          {tags && tags.length > 0 && (
						<div className="mt-6">
							<TagList
								className="flex flex-wrap gap-2"
								linkBase={`/${lang}/projects/tag/`}
								tags={tags}
								prefix="#"
								variant="default"
							/>
						</div>
					)}
				</footer>

				{/* Git Commit Timeline */}
				{commits && commits.length > 0 && (
					<section className="mt-2 pt-8">
						<div className="mb-6">
							<h2 className="text-xl font-semibold tracking-tight text-[var(--site-foreground)] sm:text-2xl">
								{isRu ? 'История коммитов' : 'Commit history'}
							</h2>
						</div>

						<div className="min-w-0">
							<CommitTree
								variant="horizontal"
								commits={commits}
							/>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
