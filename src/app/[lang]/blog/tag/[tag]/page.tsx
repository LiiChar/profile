import { BlogCard } from '@/components/blog/BlogCard';
import { db } from '@/db/db';
import { like } from 'drizzle-orm';

export default async function Tag({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const ilikeTagContain = `%${tag}%`;
	const tagBlogs = await db.query.blogs.findMany({
		where: b => like(b.tags, ilikeTagContain),
	});

	return (
		<main>
			<h1 className='my-10'>{tag}</h1>
			<div className='flex gap-4 px-2 flex-wrap 	'>
				{tagBlogs.map(b => (
					<BlogCard
						className='w-full px-4	flex-grow sm:px-0 sm:w-[calc(50%-12px)] md:w-[calc(33%-9px)]'
						blog={b}
						key={b.id}
					/>
				))}
			</div>
		</main>
	);
}
