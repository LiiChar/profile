'use client';
import React, { useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { BorderProgress } from '@/components/ui/border-progress';

export const ScrollProgressBorder = () => {
	const { scrollYProgress } = useScroll();
	const [progress, setProgress] = useState(0);
	const [width, setWidth] = useState(160);

	useEffect(() => {
		const handleResizeWindow = () => {
			setWidth(prev => document.querySelector('#nav')?.clientWidth ?? prev);
		};

		handleResizeWindow()
		
		window.addEventListener('resize', handleResizeWindow);

		return () => {
			window.removeEventListener('resize', handleResizeWindow);
		}
	}, []);

	useEffect(() => {
		return scrollYProgress.on('change', (latest) => {
			setProgress(latest);
		});
	}, [scrollYProgress]);

	return (
		<BorderProgress
			strokeColor='var(--foreground)'
			style={{
				width: `${width}px`,
				opacity: '0.5',
			}}
			strokeWidth={1}
			progress={progress}
		/>
	);
};
