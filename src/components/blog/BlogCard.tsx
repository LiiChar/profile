import { DEFAULT_IMAGE } from '@/const/image';
import { BlogType } from '@/db/tables/blog';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Separator } from '../ui/separator';
import { getDate } from '@/helpers/date';
import { timeRead } from '@/helpers/text';
import { GrowArrow } from '../ui/grow-arrow';
import { Markdown } from '../ui/markdown';
import { TagList } from '@/components/tag/TagList';

type BlogCardProps = {
	blog: BlogType;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogCard = ({ blog, className, ...attr }: BlogCardProps) => {
	return (
		<div {...attr} className={cn('flex flex-col gap-4', className)}>
			<div className='relative '>
				{(blog.image ?? DEFAULT_IMAGE) && (
					<Image
						alt={blog.title}
						fill={true}
						loading='lazy'
						src={blog.image ?? DEFAULT_IMAGE}
						className='object-cover aspect-[16/10] w-full h-full transition-all rounded-md top-0 left-0 static!'
					/>
				)}
			</div>
			{/* Контейнер, занимающий всю высоту */}
			<div className='w-full flex flex-col grow'>
				<div>
					<div className='flex gap-2 w-full items-center'>
						<div className='text-nowrap text-sm'>{getDate(blog.createdAt)}</div>
						<Separator className='w-full' />
						<div className='text-nowrap text-sm'>
							{timeRead(blog.content)} минута
						</div>
					</div>
					<div className='py-2 -m'>
						<h3 className='text-[19px]'>{blog.title}</h3>
						<div className='block sm:hidden lg:block md:hidden overflow-ellipsis h-[60px] overflow-hidden text-[16px] mt-[4px]'>
							<Markdown>{blog.content}</Markdown>
						</div>
					</div>
				</div>

				<div className='flex gap-3 items-center text-sm mt-auto'>
					{blog.tags && (
						<TagList tags={blog.tags} limit={blog.tags.length <= 24 ? 2 : 1} />
					)}
					<Separator />
					<a
						href={`/blog/${blog.id}`}
						className='text-nowrap flex group items-center gap-1'
					>
						<span>Читать статью</span>
						<GrowArrow className='scale-75 -mb-[1px]' />
					</a>
				</div>
			</div>
		</div>
	);
};
