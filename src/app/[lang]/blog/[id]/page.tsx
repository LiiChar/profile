
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db/db';
import { blogs } from '@/db/schema';
import { getDate } from '@/helpers/date';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { Metadata } from 'next';
import { getFieldLang } from '@/helpers/i18n';
import { TagList } from '@/components/tag/TagList';
import { BackwardLink } from '@/components/ui/backward-link';
import { ContentMetrics } from '@/components/metrics/ContentMetrics';
import { cn } from '@/lib/utils';
import { ContentMarkdown } from '@/components/text/ContentMarkdown';
import { BlogAdminActions } from '@/components/blog/BlogAdminActions';
import { BlogLikeWithUser } from '@/components/blog/BlogLikeWithUser';
import { CommentsListWithUser } from '@/components/comments/CommentsListWithUser';
import { MetricTracker } from '@/components/metrics/MetricTracker';
import { locales } from '@/const/i18n';
import { Lang } from '@/types/i18n';
import ArticleNav from '@/widgets/article/ArticleNav';

export const revalidate = 3600;

export async function generateStaticParams() {
	const items = await db.query.blogs.findMany({
		columns: { id: true },
	});

	return locales.flatMap(lang =>
		items.map(item => ({
			lang,
			id: String(item.id),
		}))
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string; lang: Lang }>;
}): Promise<Metadata> {
	const { id, lang } = await params;
	const blogId = Number(id);
	const blog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, blogId),
		with: {
			user: true,
			likes: true,
			comments: {
				with: {
					user: true,
				},
				orderBy: (b, { desc }) => [desc(b.id)],
			},
		},
	});

	if (!blog) {
		return {};
	}

	const title = getFieldLang(blog, 'title', lang);

	return {
		title: `${title} | Profile`,
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ id: string; lang: Lang }>;
}) {
	const { id, lang } = await params;
	const blogId = Number(id);
	const blog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, blogId),
		with: {
			user: true,
			likes: true,
			comments: {
				with: {
					user: true,
				},
				orderBy: (b, { desc }) => [desc(b.id)],
			},
			
		},
	});

	if (!blog) {
		return 'Not found';
	}

	const { image, user, title, createdAt, tags } = blog;

	return (
		<main className='max-w-3xl mx-auto my-8 px-4 relative'>
			<MetricTracker action='view' targetType='blog' targetId={blogId} />
			<BackwardLink href={`/${lang}/blog`} />
			<Card className='relative blog-detail-card'>
				<CardHeader
					className={cn(
						'px-4 sm:px-6 lg:px-8 relative',
						image ? 'pb-4 -mt-6' : '',
					)}
				>
					{image && (
						<div className='px-4 sm:px-6 lg:px-8 mb-6'>
							<Image
								fill={true}
								src={image}
								alt={`Обложка для ${title}`}
								className='w-full opacity-70 h-auto rounded-lg z-1 shadow-md object-cover'
							/>
						</div>
					)}
					<h1 className='text-4xl font-bold my-10 relative z-[2]  sm:text-5xl'>
						{getFieldLang(blog, 'title', lang)}
					</h1>
					<div className='flex w-full justify-between items-center mt-4 gap-4 relative z-[2]'>
						<div className='flex text-nowrap items-center space-x-2  text-foreground/60 text-sm'>
							<span>{user.name}</span>
							<span>·</span>
							<time dateTime={createdAt}>{getDate(createdAt)}</time>
						</div>
						<Separator className='px-3' />
						<div>
							<BlogAdminActions blogId={blog.id} lang={lang} />
						</div>
					</div>
				</CardHeader>

				{/* Контент статьи */}
				<CardContent className='px-0'>
					<div className=' max-w-3xl z-[100000000000] top-[50%] w-full pr-8 flex justify-end translate-y-[-50%] fixed pointer-events-none'>
						<ArticleNav
							className='max-w-64 overflow-auto shrink-0 relative min-[1250px]:translate-x-[100%] pointer-events-auto'
							targetSelect='.markdrow-content'
						/>
					</div>
					<div className='prose prose-lg max-w-none markdrow-content px-4 sm:px-6 lg:px-8'>
						<ContentMarkdown data={blog} field='content' />
					</div>
				</CardContent>

				{tags && (
					<div className='flex gap-3 px-8 items-center text-sm mt-auto'>
						<TagList tags={tags} linkBase={`/${lang}/blog/tag/`} />
						<Separator />
						<ContentMetrics contentId={blog.id} type='blog' />
						<BlogLikeWithUser likes={blog.likes} blogId={blog.id} />
					</div>
				)}
			</Card>
			<CommentsListWithUser
				className='mt-8'
				blogId={blogId}
				comments={blog.comments}
			/>
		</main>
	);
}
