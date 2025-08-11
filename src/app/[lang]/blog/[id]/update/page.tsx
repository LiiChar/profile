import { BlogUpdatePage } from '@/components/page/BlogUpdate';
import { db } from '@/db/db';
import { blogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function UpdateBlog({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const { id } = await params;
	const blog = await db.query.blogs.findFirst({
		where: () => eq(blogs.id, id),
		with: {
			user: true,
		},
	});

	if (!blog) {
		return 'Not found';
	}

	return <BlogUpdatePage blog={blog} />;
}
