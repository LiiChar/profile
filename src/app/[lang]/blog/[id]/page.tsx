import { BlogAction } from '@/components/blog/BlogAction';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db/db';
import { blogs } from '@/db/schema';
import { getDate } from '@/helpers/date';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import React from 'react';
import { Markdown } from '@/components/ui/markdown';
import { CommentsList } from '@/components/comments/CommentsList';
import { BlogLike } from '@/components/blog/BlogLike';
import { Metadata } from 'next';
import { getFieldLang, getLang } from '@/helpers/i18n';
import { TagList } from '@/components/tag/TagList';

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

	if (!blog) {
		return 'Not found';
	}

	const { image, user, title, createdAt, tags } = blog;

	return (
		<div className='max-w-3xl mx-auto my-8 px-4 relative'>
			<Card className=''>
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
				<CardContent className='px-4 sm:px-6 lg:px-8'>
					<div className='prose prose-lg max-w-none '>
						<Markdown>{getFieldLang(blog, 'content', lang)}</Markdown>
					</div>
				</CardContent>

				{tags && (
					<div className='flex gap-3 px-8 items-center text-sm mt-auto'>
						<TagList tags={tags} />
						<Separator />
						<BlogLike likes={blog.likes} userId={1} blogId={blog.id} />
					</div>
				)}
			</Card>
			<CommentsList
				className='mt-8'
				blogId={id}
				comments={blog.comments}
				userId={1}
			/>
		</div>
	);
}
