'use client';

import { ProjectType } from '@/db/tables/project';
import { cn } from '@/lib/utils';
import { Edit2, Trash } from 'lucide-react';
import Link from 'next/link';

type ProjectActionProps = {
	project: ProjectType;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectAction = ({
	project,
	className,
	...attr
}: ProjectActionProps) => {
	return (
		<div {...attr} className={cn('flex gap-2 h-full items-center', className)}>
			<Link href={`/projects/${project.id}/update/`}>
				<Edit2 size={16} />
			</Link>
			<div>
				<Trash size={16} />
			</div>
		</div>
	);
};
