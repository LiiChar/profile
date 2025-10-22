'use server';

import { BlogCard } from '@/components/blog/BlogCard';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { Text } from '@/components/ui/text-client';
import { db } from '@/db/db';

export const Blog = async () => {
	const blogs = await db.query.blogs.findMany({});

	return (
		<section className='z-10 relative '>
			<h2 className='mb-8'>
				<Text text='page.main.blog.title' />
			</h2>
			<Carousel>
				<CarouselContent className='gap-4 ml-0 rounded-xl p-0'>
					{blogs.map((b) => (
						<BlogCard className='min-w-[calc(33%-16px)]' key={b.id} blog={b} />
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
};
