import { BlogCard } from '@/components/blog/BlogCard';
import { db } from '@/db/db';

export default async function Blog() {
	const blogs = await db.query.blogs.findMany();
	return (
		<main>
			<h1 className='my-10'>
				Blog
			</h1>
			<div className='flex gap-4 px-2 flex-wrap 	'>
				{blogs &&
					Array.isArray(blogs) &&
					blogs.map(b => (
						<BlogCard
							className='w-full px-4	 sm:px-0 sm:w-[calc(50%-12px)] md:w-[calc(33%-9px)]'
							blog={b}
							key={b.id}
						/>
					))}
			</div>
		</main>
	);
}
