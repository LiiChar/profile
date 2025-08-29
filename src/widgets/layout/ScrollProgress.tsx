'use client';
import React, { useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { BorderProgress } from '@/components/ui/border-progress';

export const ScrollProgressBorder = () => {
	const { scrollYProgress } = useScroll();
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		return scrollYProgress.on('change', latest => {
			setProgress(latest);
		});
	}, [scrollYProgress]);

	return (
		<BorderProgress
			strokeColor='var(--foreground)'
			style={{
				width: '170px',
				opacity: '0.5',
			}}
			strokeWidth={1}
			progress={progress}
			className='backdrop-blur-[10px]'
		/>
	);
};
