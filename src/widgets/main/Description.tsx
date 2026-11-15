'use client';

import { Text } from '@/components/ui/text-client';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Description = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const reduceMotion = useReducedMotion();

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	});

	const rotateX = useTransform(
		scrollYProgress,
		[0, 1],
		reduceMotion ? [0, 0] : [8, -4]
	);
	const y = useTransform(
		scrollYProgress,
		[0, 1],
		reduceMotion ? [0, 0] : [60, -40]
	);
	const opacity = useTransform(
		scrollYProgress,
		[0, 0.3, 0.7, 1],
		reduceMotion ? [1, 1, 1, 1] : [0.4, 1, 1, 0.8],
	);

	const paragraphs = [
		'page.main.description.paragraf1',
		'page.main.description.paragraf2',
	];

  return (
    <div ref={containerRef}>

    <motion.div

					style={
						reduceMotion
							? {}
							: { rotateX, y, opacity, perspective: 1000 }
					}
					className='gpu-accelerated'
				>
					{paragraphs.map((key, index) => (
						<motion.p
							key={key}
							initial={reduceMotion ? {} : { opacity: 0, y: 0 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{
								duration: reduceMotion ? 0 : 0.8,
								delay: reduceMotion ? 0 : index * 0.25,
								ease: 'easeOut',
							}}
							className='relative text-[16px] pl-8 before:absolute before:left-0 before:top-3 before:w-[1px] before:h-8 before:bg-primary/30 before:rounded-full before:transition-all before:duration-300 hover:before:h-[calc(100%-20px)] hover:before:bg-primary/50'
						>

							<Text text={key as any} />
						</motion.p>
					))}
      </motion.div>
    </div>

	);
};
