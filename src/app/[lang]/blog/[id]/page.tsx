
import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { blogs } from '@/db/schema';

import { locales } from '@/const/i18n';
import { Lang } from '@/types/i18n';

import { getFieldLang } from '@/helpers/i18n';
import { normalizeImageUrl } from '@/helpers/url';

import { TagList } from '@/components/tag/TagList';
import { ContentMetrics } from '@/components/metrics/ContentMetrics';
import { MetricTracker } from '@/components/metrics/MetricTracker';
import { ContentMarkdown } from '@/components/text/ContentMarkdown';

import { BlogAdminActions } from '@/components/blog/BlogAdminActions';
import { BlogLikeWithUser } from '@/components/blog/BlogLikeWithUser';
import { CommentsListWithUser } from '@/components/comments/CommentsListWithUser';

import { BackwardLink } from '@/components/ui/backward-link';
import ArticleNav from '@/widgets/article/ArticleNav';

export const revalidate = 3600;

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const getBlog = cache(async (id: number) => {
	return db.query.blogs.findFirst({
		where: eq(blogs.id, id),
		with: {
			user: true,
			likes: true,
			comments: {
				with: {
					user: true,
				},
				orderBy: (blog, { desc }) => [desc(blog.id)],
			},
		},
	});
});

/* -------------------------------------------------------------------------- */
/*                                Static params                               */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
	const items = await db.query.blogs.findMany({
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

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string; lang: Lang }>;
}): Promise<Metadata> {
	const { id, lang } = await params;
	const blogId = Number(id);

	if (!Number.isSafeInteger(blogId) || blogId <= 0) {
		return {
			title: 'Blog Not Found',
		};
	}

	const blog = await getBlog(blogId);

	if (!blog) {
		return {
			title: 'Blog Not Found',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const title = getFieldLang(blog, 'title', lang);

	return {
		title: `${title} | Blog - Maksim Ivanov`,
		openGraph: {
			title,
			type: 'article',
			publishedTime: new Date(blog.createdAt).toISOString(),
			authors: [blog.user.name],
			images: blog.image
				? [
						{
							url: normalizeImageUrl(blog.image),
							alt: title,
						},
					]
				: undefined,
		},
		twitter: {
			card: blog.image ? 'summary_large_image' : 'summary',
			title,
			images: blog.image
				? [normalizeImageUrl(blog.image)]
				: undefined,
		},
	};
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

type BlogPageProps = {
	params: Promise<{
		id: string;
		lang: Lang;
	}>;
};

export default async function BlogPage({
	params,
}: BlogPageProps) {
	const { id, lang } = await params;
	const blogId = Number(id);

	if (!Number.isSafeInteger(blogId) || blogId <= 0) {
		notFound();
	}

	const blog = await getBlog(blogId);

	if (!blog) {
		notFound();
	}

	const {
		id: contentId,
		user,
		createdAt,
		image,
		tags,
		likes,
		comments,
	} = blog;

	const title = getFieldLang(blog, 'title', lang);

	const isRu = lang === 'ru';

	const formattedDate = new Intl.DateTimeFormat(
		isRu ? 'ru-RU' : 'en-US',
		{
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}
	).format(new Date(createdAt));

	return (
		<main className="relative">
			<MetricTracker
				action="view"
				targetType="blog"
				targetId={blogId}
			/>

			<div className="site-container mx-auto max-w-4xl px-4 py-10 sm:py-14">

				{/* Navigation */}
				<div className="mb-10">
					<BackwardLink href={`/${lang}/blog`} />
				</div>

				{/* Header */}
				<header className="mb-8">
					<div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--site-subtle)]">
						<span>
							{isRu ? 'Статья' : 'Article'}
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

						<span>{user.name}</span>
					</div>

					<h1 className="py-12">
						{title}
					</h1>
				</header>

				{/* Cover */}
				{image && (
					<div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-lg bg-[var(--site-border)] sm:aspect-video">
						<Image
							fill
							src={normalizeImageUrl(image)}
							alt={title}
							sizes="(max-width: 768px) 100vw, 896px"
							priority
							className="object-cover"
						/>
					</div>
				)}

				{/* Content */}
				<article className="relative min-w-0">
					{/* Article navigation */}
					<div className="pointer-events-none fixed top-1/2 z-20 flex w-full max-w-4xl -translate-y-1/2 justify-end pr-8">
						<ArticleNav
							className="pointer-events-auto relative hidden max-w-64 shrink-0 overflow-auto min-[1250px]:block min-[1250px]:translate-x-full"
							targetSelect=".markdrow-content"
						/>
					</div>

					<div className="prose prose-lg markdrow-content max-w-none">
						<ContentMarkdown
							data={blog}
							field="content"
						/>
					</div>
				</article>

				{/* Footer */}
				<footer className="mt-12 border-t border-[var(--site-border)] pt-6">
					<div className="flex flex-col gap-5">

						{/* Author and actions */}
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3 text-sm text-[var(--site-muted)]">
								<span>
									{isRu ? 'Автор' : 'Author'}:
								</span>

								<span className="font-medium text-[var(--site-foreground)]">
									{user.name}
								</span>
							</div>

							<div className="flex shrink-0 items-center gap-3">
								<ContentMetrics
									contentId={contentId}
									type="blog"
								/>

								<BlogLikeWithUser
									likes={likes}
									blogId={contentId}
								/>

								<BlogAdminActions
									blogId={contentId}
									lang={lang}
								/>
							</div>
						</div>

						{/* Tags */}
						{tags && tags.length > 0 && (
							<div className="mt-2">
								<TagList
									className="flex flex-wrap gap-2"
									linkBase={`/${lang}/blog/tag/`}
									tags={tags}
									prefix="#"
									variant="default"
								/>
							</div>
						)}
					</div>
				</footer>

				{/* Comments */}
				<section className="mt-12 border-t border-[var(--site-border)] pt-8">
					<div className="mb-6">
						<h2 className="text-xl font-semibold tracking-tight text-[var(--site-foreground)] sm:text-2xl">
							{isRu ? 'Обсуждение' : 'Discussion'}
						</h2>
					</div>

					<CommentsListWithUser
						blogId={blogId}
						comments={comments}
					/>
				</section>
			</div>
		</main>
	);
}
