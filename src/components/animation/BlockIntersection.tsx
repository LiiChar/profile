'use client';

import { HTMLAttributes, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type BlockIntersectionProps = {
	height: number;
} & HTMLAttributes<HTMLDivElement>;

export const BlockIntersection = ({
	children,
	height,
	className,
	...props
}: BlockIntersectionProps) => {
	const { ref, entry } = useInView({
		threshold: 0.5,
		triggerOnce: false,
		trackVisibility: true,
		delay: 100,
	});

	const isVisible = useMemo(() => entry?.isIntersecting ?? false, [entry]);

	return (
		<div
			{...props}
			ref={ref}
			className={cn('relative w-full', className)}
			style={{ height }}
		>
			<AnimatePresence mode='wait'>
				{isVisible && (
					<motion.div
						key='block'
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -40 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className='sticky top-[40%]'
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
