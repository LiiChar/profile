import { DEFAULT_IMAGE } from '@/const/image';
import { BlogType } from '@/db/tables/blog';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Separator } from '../ui/separator';
import { GrowArrow } from '../ui/grow-arrow';
import { TagList } from '@/components/tag/TagList';
import Link from 'next/link';
import { TimeRead } from '../text/TimeRead';
import { Text } from '../ui/text-server';
import { Date } from '../date/Date';
import { Content } from '../text/Content';
import { ContentMarkdown } from '../text/ContentMarkdown';
import { Lang } from '@/types/i18n';

type BlogCardProps = {
	blog: BlogType;
	lang: Lang;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogCard = ({ blog, lang, className, ...attr }: BlogCardProps) => {
	const basePath = `/${lang}`;
	const blogHref = `${basePath}/blog/${blog.id}`;
	const tagBase = `${basePath}/blog/tag/`;

	return (
		<div 
			{...attr} 
			className={cn(
				'flex flex-col gap-4 group/card transition-all duration-300',
				className
			)}
		>
			<Link
				href={blogHref}
				className='relative overflow-hidden rounded-md'
			>
				{(blog.image ?? DEFAULT_IMAGE) && (
					<Image
						alt={blog.title}
						fill={true}
						loading='lazy'
						src={blog.image ?? DEFAULT_IMAGE}
						className='object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 aspect-[16/10] w-full h-full rounded-md top-0 left-0 static!'
					/>
				)}
				{/* Overlay gradient on hover */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300' />
			</Link>
			{/* Контейнер, занимающий всю высоту */}
			<div className='w-full flex flex-col grow'>
				<div>
					<div className='flex gap-2 w-full items-center'>
						<Date date={blog.createdAt} />
						<Separator className='w-full transition-all duration-300 group-hover/card:bg-primary/30' />
						<TimeRead content={blog.content} />
					</div>
					<div className='py-2 -m'>
						<h3 className='text-[19px] transition-colors duration-300 group-hover/card:text-primary'>
							<Content data={blog} field='title'/>
						</h3>
						<div className='block sm:hidden lg:block md:hidden overflow-ellipsis h-[60px] overflow-hidden text-[16px] mt-[4px] text-foreground/70 transition-colors duration-300 group-hover/card:text-foreground/90'>
							<ContentMarkdown data={blog} field='content' />
						</div>
					</div>
				</div>

				<div className='flex gap-3 items-center text-sm mt-auto'>
					{blog.tags && (
						<TagList
							tags={blog.tags}
							limit={blog.tags.length <= 24 ? 2 : 1}
							linkBase={tagBase}
						/>
					)}
					<Separator />
					<Link
						href={blogHref}
						className='text-nowrap flex group items-center gap-1 animated-underline transition-colors duration-300 hover:text-primary'
					>
						<span>
							<Text text='blog.readArticle' />
						</span>
						<GrowArrow className='scale-75 -mb-[1px] transition-transform duration-300 group-hover:translate-x-1' />
					</Link>
				</div>
			</div>
		</div>
	);
};
