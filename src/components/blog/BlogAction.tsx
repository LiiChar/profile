'use client';
import { cn } from '@/lib/utils';
import { Edit2, Trash } from 'lucide-react';
import Link from 'next/link';

type BlogActionProps = {
	blogId: number;
	basePath?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogAction = ({ blogId, basePath, className, ...attr }: BlogActionProps) => {
	const prefix = basePath
		? basePath.startsWith('/') ? basePath : `/${basePath}`
		: '';
	const href = `${prefix}/blog/${blogId}/update/`;

	return (
		<div {...attr} className={cn('flex gap-2 h-full items-center', className)}>
			<Link href={href}>
				<Edit2 size={16} />
			</Link>
			<div>
				<Trash size={16} />
			</div>
		</div>
	);
};
