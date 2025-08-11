import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TagListVariant = 'separator' | 'default';

const VariantStyle: Record<
	TagListVariant,
	{
		wrapper: string;
		item: string;
	}
> = {
	default: {
		item: 'bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-full px-3 py-1',
		wrapper: '',
	},
	separator: {
		item: '',
		wrapper: '',
	},
};

type TagListProps = {
	tags: string | string[];
	limit?: number;
	separator?: ReactNode;
	prefix?: ReactNode;
	linkBase?: string;
	variant?: TagListVariant;
} & React.HTMLAttributes<HTMLDivElement>;

export const TagList = ({
	tags,
	limit = tags.length,
	separator = <Separator orientation='vertical' />,
	prefix,
	linkBase = `/blog/tag/`,
	variant = 'separator',
	...attr
}: TagListProps) => {
	return (
		<div
			{...attr}
			className={cn(
				'flex gap-1 text-foreground/60',
				VariantStyle[variant]['wrapper'],
				attr.className
			)}
		>
			{(typeof tags == 'string' ? tags.split(',') : tags)
				.slice(0, limit)
				.map(t => t.trim())
				.filter(Boolean)
				.map((t, i, arr) => (
					<div
						key={t}
						className={cn('flex gap-1', VariantStyle[variant]['item'])}
					>
						<Link href={linkBase + t} className='text-nowrap'>
							{prefix && prefix}
							{t}
						</Link>
						{i !== arr.length - 1 && variant == 'separator' && <>{separator}</>}
					</div>
				))}
		</div>
	);
};
