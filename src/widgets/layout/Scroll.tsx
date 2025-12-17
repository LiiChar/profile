'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Scroll = () => {
	const [isVisible, setIsVisible] = useState(false);
	const tickingRef = useRef(false);

	const handleScroll = useCallback(() => {
		if (!tickingRef.current) {
			tickingRef.current = true;
			requestAnimationFrame(() => {
				setIsVisible(window.scrollY > 200);
				tickingRef.current = false;
			});
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	const buttonClasses =
		'fixed top-[15%] w-12 left-6 min-[980px]:flex hidden min-[980px]:left-[calc(25%-238px)] group gap-2 flex-col justify-center items-center cursor-pointer';

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.a
					onClick={scrollToTop}
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -50, opacity: 0 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					className={buttonClasses}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						className='group-hover:-translate-y-1 fill-foreground transition-all w-[36px]'
					>
						<title>Jump back to top button</title>
						<path d='M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z' />
					</svg>
					<p
						style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}
						className='text-center w-min mt-1 !group-hover:no-underline'
					>
						back to top
					</p>
				</motion.a>
			)}
		</AnimatePresence>
	);
};
