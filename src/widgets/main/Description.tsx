'use client';

import { Text } from '@/components/ui/text-client';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Description = () => {
	const containerRef = useRef<HTMLElement | null>(null);
	const reduceMotion = useReducedMotion();

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	});

	const rotateX = useTransform(
		scrollYProgress,
		[0, 1],
<<<<<<< HEAD
		reduceMotion ? [0, 0] : [8, -4]
=======
		reduceMotion ? [0, 0] : [8, -4],
>>>>>>> 59a71592f36d324f28a30cf71afabfc84cf1b6c5
	);
	const y = useTransform(
		scrollYProgress,
		[0, 1],
<<<<<<< HEAD
		reduceMotion ? [0, 0] : [60, -40]
=======
		reduceMotion ? [0, 0] : [60, -40],
>>>>>>> 59a71592f36d324f28a30cf71afabfc84cf1b6c5
	);
	const opacity = useTransform(
		scrollYProgress,
		[0, 0.3, 0.7, 1],
		reduceMotion ? [1, 1, 1, 1] : [0.4, 1, 1, 0.8],
	);

	const paragraphs = [
		'page.main.description.paragraf1',
		'page.main.description.paragraf2',
		'page.main.description.paragraf3',
	];

	return (
		<section
			id='description'
			ref={containerRef}
			className='site-section scroll-mt-[100px] contain-layout'
		>
			<div className='site-container'>
				<motion.div
					initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{
						duration: reduceMotion ? 0 : 0.8,
						ease: 'easeOut',
					}}
					className='mb-10 md:mb-14'
				>
					<h2 className='site-section-title animated-underline inline-block'>
						<Text text='page.main.description.title' />
					</h2>
				</motion.div>

				<motion.div
					style={
						reduceMotion
							? {}
							: { rotateX, y, opacity, perspective: 1000 }
					}
					className='site-reading-width space-y-7 md:space-y-9 gpu-accelerated'
				>
					{paragraphs.map((key, index) => (
						<motion.p
							key={key}
							initial={reduceMotion ? {} : { opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{
								duration: reduceMotion ? 0 : 0.8,
								delay: reduceMotion ? 0 : index * 0.25,
								ease: 'easeOut',
							}}
<<<<<<< HEAD
							className='relative pl-8 before:absolute before:left-0 before:top-3 before:w-1 before:h-8 before:bg-primary/30 before:rounded-full before:transition-all before:duration-300 hover:before:h-[calc(100%-20px)] hover:before:bg-primary/50'
=======
							className='group relative border-l border-[var(--site-border)] py-1 pl-5 text-[clamp(1.025rem,1.5vw,1.15rem)] leading-[1.9] text-[var(--site-muted)] transition-colors duration-300 hover:border-[var(--site-accent)] md:pl-7'
>>>>>>> 59a71592f36d324f28a30cf71afabfc84cf1b6c5
						>
							<span
								aria-hidden='true'
								className='pointer-events-none absolute -left-px top-1/2 h-8 w-px -translate-y-1/2 bg-[var(--site-accent)] opacity-35 transition-all duration-300 group-hover:opacity-100'
							/>
							<Text text={key as any} />
						</motion.p>
					))}
				</motion.div>
<<<<<<< HEAD
=======

				<motion.div
					initial={reduceMotion ? {} : { scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					viewport={{ once: true }}
					transition={{
						duration: reduceMotion ? 0 : 1.2,
						delay: reduceMotion ? 0 : 0.8,
					}}
					className='mt-16 h-px origin-left bg-gradient-to-r from-[var(--site-accent)]/0 via-[var(--site-accent)]/30 to-[var(--site-accent)]/0 md:mt-20'
				/>
>>>>>>> 59a71592f36d324f28a30cf71afabfc84cf1b6c5
			</div>
		</section>
	);
};
