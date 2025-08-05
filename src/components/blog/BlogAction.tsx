'use client';

import { BlogType } from '@/db/tables/blog';
import { cn } from '@/lib/utils';
import { Edit2, Trash } from 'lucide-react';
import Link from 'next/link';

type BlogActionProps = {
	blog: BlogType;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogAction = ({ blog, className, ...attr }: BlogActionProps) => {
	return (
		<div {...attr} className={cn('flex gap-2 h-full items-center', className)}>
			<Link href={`/blog/${blog.id}/update/`}>
				<Edit2 size={16} />
			</Link>
			<div>
				<Trash size={16} />
			</div>
		</div>
	);
};
