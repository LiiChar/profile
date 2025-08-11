'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const variants = {
	initial: {
		x: '-100vw',
		opacity: 0,
	},
	animate: {
		x: 0,
		opacity: 1,
	},
	exit: {
		x: '100vw',
		opacity: 0,
	},
};

export default function PageTransition({ children }: { children: ReactNode }) {
	return (
		<motion.div
			variants={variants}
			initial='initial'
			animate='animate'
			exit='exit'
			transition={{ duration: 0.4, ease: 'easeInOut' }}
		>
			{children}
		</motion.div>
	);
}
