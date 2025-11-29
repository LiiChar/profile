'use client';

import { Text } from '@/components/ui/text-client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Description = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	});

	// Плавный 3D-эффект при скролле
	const rotateX = useTransform(scrollYProgress, [0, 1], [8, -4]);
	const y = useTransform(scrollYProgress, [0, 1], [60, -40]);
	const opacity = useTransform(
		scrollYProgress,
		[0, 0.3, 0.7, 1],
		[0.4, 1, 1, 0.8]
	);

	const paragraphs = [
		'page.main.description.paragraf1',
		'page.main.description.paragraf2',
		'page.main.description.paragraf3',
	];

	return (
		<section
			ref={containerRef}
		>
			<div className=''>
				{/* Заголовок с акцентом */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
				>
					<h2 className='tracking-tight mb-8'>
						<Text text='page.main.description.title' />
					</h2>
				</motion.div>

				{/* Текст с последовательным появлением */}
				<motion.div
					style={{ rotateX, y, opacity, perspective: 1000 }}
					className='space-y-9  text-foreground/80'
				>
					{paragraphs.map((key, index) => (
						<motion.p
							key={key}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{
								duration: 0.8,
								delay: index * 0.25,
								ease: 'easeOut',
							}}
							className='relative pl-8 before:absolute before:left-0 before:top-3 before:w-1 before:h-8 before:bg-primary/30 before:rounded-full'
						>
								<Text text={key as any} />
						</motion.p>
					))}
				</motion.div>

				{/* Декоративный элемент внизу */}
				<motion.div
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1.2, delay: 0.8 }}
					className='h-px bg-gradient-to-r translate-y-6 from-transparent via-primary/30 to-transparent'
				/>
			</div>
		</section>
	);
};
