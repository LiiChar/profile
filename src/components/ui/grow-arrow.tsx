import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type GrowArrowProps = {
	variant?: 'up' | 'down' | 'left' | 'right';
	color?: HTMLAttributes<HTMLDivElement>['className'];
} & HTMLAttributes<HTMLDivElement>;

export const GrowArrow = ({
	variant = 'right',
	color = 'bg-foreground',
	className,
	...attr
}: GrowArrowProps) => {
	const rotateMap: Record<string, string> = {
		right: 'rotate-0',
		down: 'rotate-90',
		left: 'rotate-180',
		up: '-rotate-90',
	};

	return (
		<div
			{...attr}
			className={cn(
				'group flex items-center min-h-4 h-full w-full justify-center',
				rotateMap[variant],
				className
			)}
		>
			{/* линия */}
			<div
				className={cn(
					'h-[2px] w-6 bg-black transition-all duration-300 group-hover:w-9 group-hover:bg-primary',
					color
				)}
			/>

			{/* наконечник */}
			<div className='relative'>
				<div
					className={cn(
						'w-[2px] h-[9px] bg-black ml-1 transition-all duration-300  absolute rotate-[135deg] right-1 -top-[7px] origin-right group-hover:bg-primary',
						color
					)}
				/>
				<div
					className={cn(
						'w-[2px] h-[9px] bg-black ml-1 transition-all duration-300  absolute rotate-[225deg] right-1 -top-[3px]  origin-right group-hover:bg-primary',
						color
					)}
				/>
			</div>
		</div>
	);
};
