
import { BlogAction } from '@/components/blog/BlogAction';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db/db';
import { blogs, metrics } from '@/db/schema';
import { getDate } from '@/helpers/date';
import { and, eq } from 'drizzle-orm';
import Image from 'next/image';
import React from 'react';
import { Markdown } from '@/components/ui/markdown';
import { CommentsList } from '@/components/comments/CommentsList';
import { BlogLike } from '@/components/blog/BlogLike';
import { Metadata } from 'next';
import { getFieldLang, getLang } from '@/helpers/i18n';
import { TagList } from '@/components/tag/TagList';
import ArticleNav from '@/widgets/article/ArticleNav';
import { getCurrentUser } from '@/action/auth/login';
import { addMetric } from '@/action/metrics/addMetric';
import { Eye } from 'lucide-react';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: number }>;
}): Promise<Metadata> {
	const { id } = await params;
	const blog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, id),
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

	return {
		title: `${blog.title} | Profile`,
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const lang = await getLang();
	const { id } = await params;
	const blog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, id),
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
	const metric = await db.query.metrics.findMany({
		where: () => and(eq(metrics.targetId, id), eq(metrics.targetType, 'blog')),
		with: {
			user: true,
		},
		orderBy: (m, { desc }) => [desc(m.id)],
	});
	
	const users = new Set(
		metric.filter(m => m.action === 'view').map(m => m.userId)
	);

	const view = users.size;

	const currentUser = await getCurrentUser();

	if (!blog) {
		return 'Not found';
	}

	// Track view metric
	await addMetric({ action: 'view', targetType: 'blog', targetId: id });

	const { image, user, title, createdAt, tags } = blog;

	return (
		<main className='max-w-3xl mx-auto my-8 px-4 relative'>
			<Card className='relative'>
				<CardHeader className='px-4 sm:px-6 lg:px-8'>
					<h1 className='text-4xl font-bold my-10  sm:text-5xl'>
						{getFieldLang(blog, 'title', lang)}
					</h1>
					<div className='flex w-full justify-between items-center mt-4 gap-4'>
						<div className='flex text-nowrap items-center space-x-2  text-foreground/60 text-sm'>
							<span>{user.name}</span>
							<span>·</span>
							<time dateTime={createdAt}>{getDate(createdAt)}</time>
						</div>
						<Separator className='px-3' />
						<div>
							<BlogAction blog={blog} />
						</div>
					</div>
				</CardHeader>

				{image && (
					<div className='px-4 sm:px-6 lg:px-8 mb-6'>
						<Image
							fill={true}
							src={image}
							alt={`Обложка для ${title}`}
							className='w-full h-auto rounded-lg shadow-md object-cover'
						/>
					</div>
				)}

				{/* Контент статьи */}
				<CardContent className='px-0'>
					<div className=' max-w-3xl z-[100000000000] top-[50%] w-full pr-8 flex justify-end translate-y-[-50%] fixed'>
						<ArticleNav
							className=' relative   min-[1250px]:translate-x-[100%]'
							targetSelect='.markdrow-content'
						/>
					</div>
					<div className='prose prose-lg max-w-none markdrow-content px-4 sm:px-6 lg:px-8'>
						<Markdown>{getFieldLang(blog, 'content', lang)}</Markdown>
					</div>
				</CardContent>

				{tags && (
					<div className='flex gap-3 px-8 items-center text-sm mt-auto'>
						<TagList tags={tags} />
						<Separator />
						<div className='flex gap-2 text-xs bg-secondary px-[10px] py-1 rounded-md items-center  select-none'>
							<Eye size={18}/>
							<div>{view}</div>
						</div>
						<BlogLike
							likes={blog.likes}
							currentUserId={currentUser?.id}
							blogId={blog.id}
						/>
					</div>
				)}
			</Card>
			<CommentsList
				className='mt-8'
				blogId={id}
				comments={blog.comments}
				currentUserId={currentUser?.id}
			/>
		</main>
	);
}
