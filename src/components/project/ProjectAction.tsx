'use client';
import { cn } from '@/lib/utils';
import { Edit2, Trash } from 'lucide-react';
import Link from 'next/link';

type ProjectActionProps = {
	projectId: number;
	basePath?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectAction = ({
	projectId,
	basePath,
	className,
	...attr
}: ProjectActionProps) => {
	const prefix = basePath
		? basePath.startsWith('/') ? basePath : `/${basePath}`
		: '';
	const href = `${prefix}/projects/${projectId}/update/`;

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
