'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BlockIntersectionProps = {
	height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

export const BlockIntersection = ({
	children,
	height,
	className,
	...props
}: BlockIntersectionProps) => {
	return (
		<div
			{...props}
			className={cn('relative w-full', className)}
			style={height ? { height } : undefined}
		>
			<div data-aos="fade-up" className="sticky top-[40%]">
				{children}
			</div>
		</div>
	);
};
