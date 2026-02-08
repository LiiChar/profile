import { BlogCard } from '@/components/blog/BlogCard';
import { db } from '@/db/db';
import { like } from 'drizzle-orm';
import { locales } from '@/const/i18n';
import { Lang } from '@/types/i18n';

export const revalidate = 3600;

const extractTags = (value?: string | null) =>
	value
		? value
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean)
		: [];

export async function generateStaticParams() {
	const rows = await db.query.blogs.findMany({
		columns: { tags: true },
	});

	const tags = new Set<string>();
	rows.forEach(row => {
		extractTags(row.tags).forEach(tag => tags.add(tag));
	});

	return locales.flatMap(lang =>
		Array.from(tags).map(tag => ({
			lang,
			tag,
		}))
	);
}

export default async function Tag({
	params,
}: {
	params: Promise<{ tag: string; lang: Lang }>;
}) {
	const { tag, lang } = await params;
	const ilikeTagContain = `%${tag}%`;
	const tagBlogs = await db.query.blogs.findMany({
		where: b => like(b.tags, ilikeTagContain),
	});

	return (
		<main>
			<h1 className='my-10'>{tag}</h1>
			<div className='flex gap-4 px-2 flex-wrap 	'>
				{tagBlogs &&
					Array.isArray(tagBlogs) &&
					tagBlogs.map(b => (
						<BlogCard
							className='w-full px-4	flex-grow sm:px-0 sm:w-[calc(50%-12px)] md:w-[calc(33%-9px)]'
							blog={b}
							lang={lang}
							key={b.id}
						/>
					))}
			</div>
		</main>
	);
}
