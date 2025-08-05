'use client';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export const CommentCardAnimation = ({ children }: PropsWithChildren) => {
	return (
		<motion.article
			className='w-full flex gap-2'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.2 }}
		>
			{children}
		</motion.article>
	);
};
