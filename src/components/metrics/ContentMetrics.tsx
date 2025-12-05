'use server';

import { db } from '@/db/db';
import { metrics as metricsSchema } from '@/db/tables/metrics';
import { cn } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { Eye } from 'lucide-react';

type ContentMetricsProps = {
  contentId: number;
  type: 'blog' | 'project';
} & React.HTMLAttributes<HTMLDivElement>;

export const ContentMetrics = async ({
	contentId,
	type,
	...attr
}: ContentMetricsProps) => {
	const metric = await db.query.metrics.findMany({
		where: () =>
			and(
				eq(metricsSchema.targetId, contentId),
				eq(metricsSchema.targetType, type)
			),
		with: {
			user: true,
		},
		orderBy: (m, { desc }) => [desc(m.id)],
	});

	const users = new Set(
		metric.filter(m => m.action === 'view').map(m => m.userId)
	);

	const view = users.size;
	return (
		<div
			{...attr}
			className={cn(
				'flex gap-2 text-xs bg-secondary px-[10px] py-1 rounded-md items-center  select-none',
				attr.className
			)}
		>
			<Eye size={18} />
			<div>{view}</div>
		</div>
	);
};