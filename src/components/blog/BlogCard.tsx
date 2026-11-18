
import { DEFAULT_IMAGE } from '@/const/image';
import { BlogType } from '@/db/tables/blog';
import { Lang } from '@/types/i18n';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ArrowUpRight } from 'lucide-react';

import { TagList } from '@/components/tag/TagList';
import { TimeRead } from '../text/TimeRead';
import { Text } from '../ui/text-server';
import { Date } from '../date/Date';
import { Content } from '../text/Content';

type BlogCardProps = {
	blog: BlogType;
	lang: Lang;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogCard = ({
	blog,
	lang,
	className,
	...attr
}: BlogCardProps) => {
	const blogHref = `/${lang}/blog/${blog.id}`;
	const tagBase = `/${lang}/blog/tag/`;

	return (
		<article
			{...attr}
			className={cn(
				'group/card flex min-w-0 flex-col',
				className,
			)}
		>
			{/* Cover */}
			<Link
				href={blogHref}
				aria-label={blog.title}
				className="
					group/image relative block
					aspect-[16/10] w-full
					overflow-hidden rounded-lg
					bg-[var(--site-border)]
					outline-none
					focus-visible:ring-2
					focus-visible:ring-[var(--site-accent)]
					focus-visible:ring-offset-2
					focus-visible:ring-offset-background
				"
			>
				<Image
					src={blog.image || DEFAULT_IMAGE}
					alt={blog.title}
					fill
					sizes="
						(max-width: 640px) 100vw,
						(max-width: 1024px) 50vw,
						33vw
					"
					className="
						object-cover
						transition-transform duration-700
						ease-out
						group-hover/image:scale-105
					"
				/>

				{/* Image overlay */}
				<div
					aria-hidden="true"
					className="
						absolute inset-0
						bg-gradient-to-t
						from-black/30 via-transparent
						to-transparent
						opacity-60
						transition-opacity duration-300
						group-hover/image:opacity-100
					"
				/>

				{/* Read indicator */}
				<span
					aria-hidden="true"
					className="
						absolute bottom-3 right-3
						flex h-9 w-9 items-center
						justify-center rounded-full
						border border-white/20
						bg-black/30 text-white
						backdrop-blur-md
						opacity-0 translate-y-2
						transition-all duration-300
						group-hover/image:translate-y-0
						group-hover/image:opacity-100
					"
				>
					<ArrowUpRight className="h-4 w-4" />
				</span>
			</Link>

			{/* Content */}
			<div className="
				flex flex-1 flex-col
				pt-4 sm:pt-5
			">
				{/* Metadata */}
				<div className="
					flex flex-wrap items-center
					gap-x-3 gap-y-2
					font-mono text-xs
					uppercase tracking-[0.12em]
					text-[var(--site-subtle)]
				">
					<Date date={blog.createdAt} />

					<span
						aria-hidden="true"
						className="
							h-1 w-1 rounded-full
							bg-[var(--site-accent)]/60
						"
					/>

					<TimeRead content={blog.content} />
				</div>

				{/* Title */}
				<Link
					href={blogHref}
					className="
						mt-3 block w-fit
						outline-none
						focus-visible:underline
						focus-visible:decoration-[var(--site-accent)]
					"
				>
					<h3 className="
						text-lg font-semibold
						leading-snug tracking-tight
						text-[var(--site-foreground)]
						transition-colors duration-300
						group-hover/card:text-[var(--site-accent)]
						sm:text-xl
					">
						<Content data={blog} field="title" />
					</h3>
				</Link>

				{/* Footer */}
				<div className="
					mt-auto flex flex-wrap
					items-center justify-between
					gap-3 pt-5
				">
					<div className="min-w-0">
						{blog.tags && blog.tags.length > 0 && (
							<TagList
								tags={blog.tags}
								limit={2}
                linkBase={tagBase}
								separator="&#10072;"
							/>
						)}
					</div>

					<Link
						href={blogHref}
						className="
							group/read inline-flex shrink-0
							items-center gap-1.5
							whitespace-nowrap
							text-xs font-medium
							text-[var(--site-muted)]
							transition-colors duration-300
							hover:text-[var(--site-accent)]
							focus-visible:outline-none
							focus-visible:ring-2
							focus-visible:ring-[var(--site-accent)]
							focus-visible:ring-offset-2
						"
					>
						<Text text="blog.readArticle" />

						<ArrowUpRight className="
							h-3.5 w-3.5
							transition-transform duration-300
							group-hover/read:-translate-y-0.5
							group-hover/read:translate-x-0.5
						" />
					</Link>
				</div>
			</div>
		</article>
	);
};

BlogCard.displayName = 'BlogCard';
