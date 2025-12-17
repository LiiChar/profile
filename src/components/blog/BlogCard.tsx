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

type BlogCardProps = {
	blog: BlogType;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogCard = ({ blog, className, ...attr }: BlogCardProps) => {
	

	return (
		<div {...attr} className={cn('flex flex-col gap-4', className)}>
			<Link
				href={`/blog/${blog.id}`}
				className='relative overflow-hidden rounded-md'
			>
				{(blog.image ?? DEFAULT_IMAGE) && (
					<Image
						alt={blog.title}
						fill={true}
						loading='lazy'
						src={blog.image ?? DEFAULT_IMAGE}
						className='object-cover hover:scale-110 transition-all aspect-[16/10] w-full h-full rounded-md top-0 left-0 static!'
					/>
				)}
			</Link>
			{/* Контейнер, занимающий всю высоту */}
			<div className='w-full flex flex-col grow'>
				<div>
					<div className='flex gap-2 w-full items-center'>
						<Date date={blog.createdAt} />
						<Separator className='w-full' />
						<TimeRead content={blog.content} />
					</div>
					<div className='py-2 -m'>
						<h3 className='text-[19px]'><Content data={blog} field='title'/></h3>
						<div className='block sm:hidden lg:block md:hidden overflow-ellipsis h-[60px] overflow-hidden text-[16px] mt-[4px]'>
							<ContentMarkdown data={blog} field='content' />
						</div>
					</div>
				</div>

				<div className='flex gap-3 items-center text-sm mt-auto'>
					{blog.tags && (
						<TagList tags={blog.tags} limit={blog.tags.length <= 24 ? 2 : 1} />
					)}
					<Separator />
					<Link
						href={`/blog/${blog.id}`}
						className='text-nowrap flex group items-center gap-1'
					>
						<span>
							<Text text='blog.readArticle' />
						</span>
						<GrowArrow className='scale-75 -mb-[1px]' />
					</Link>
				</div>
			</div>
		</div>
	);
};
