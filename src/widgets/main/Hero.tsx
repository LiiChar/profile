'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Text } from '@/components/ui/text-client';
import { GrowArrow } from '@/components/ui/grow-arrow';
import dynamic from 'next/dynamic';
const ContactModal = dynamic(() => import('../modal/ContactModal.js').then(mod => mod.ContactModal), {
	ssr: false,
});
import TextType from '@/components/ui/text-type';
import { getText } from '@/helpers/i18n-client';
import { useDictionaryStore } from '@/stores/lang/langStore';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const Hero = ({}) => {
	const dict = useDictionaryStore(state => state.dictionary);
	const reduceMotion = useReducedMotion();

	// Simplified animations for reduced motion
	const fadeIn = reduceMotion 
		? { initial: {}, animate: {}, transition: { duration: 0 } }
		: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

	const scaleIn = reduceMotion
		? { initial: {}, animate: {}, transition: { duration: 0 } }
		: { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 1, delay: 0.6 } };

	const fadeInDelayed = reduceMotion
		? { initial: {}, animate: {}, transition: { duration: 0 } }
		: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6, duration: 0.6 } };

	return (
		<section
			id='hero'
			className='mx-auto relative min-h-screen text-center h-full flex flex-col justify-center items-center z-20 contain-layout'
		>
			<div className='relative'>
				<motion.h1
					{...fadeIn}
					className='gpu-accelerated'
				>
					<Text text='page.main.hero.title' />
				</motion.h1>
				<motion.div
					{...scaleIn}
					className='mt-6 h-1 w-32 mx-auto bg-primary/60 rounded-full origin-left'
				/>
			</div>
			<div className='text-lg mt-5 md:text-xl mb-4 text-foreground/70 sm:px-8 px-4'>
				{reduceMotion ? (
					<span>{getText('page.main.hero.description', dict!)}</span>
				) : (
					<TextType text={[getText('page.main.hero.description', dict!)]} />
				)}
			</div>

			<motion.div
				{...fadeInDelayed}
				className='flex justify-center gap-4 stagger-children'
			>
				<ContactModal>
					<Button 
						variant='outline' 
						className='border-gray-600 text-foreground hover-lift hover:border-primary/50 transition-all duration-300'
					>
						<Mail className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12' />{' '}
						<Text text='page.main.hero.button2' />
					</Button>
				</ContactModal>
				<Link href={'/projects'}>
					<Button variant='default' className='group hover-lift relative overflow-hidden'>
						<span className='relative z-10'>
							<Text text='page.main.hero.button1' />
						</span>
						<GrowArrow
							variant='right'
							color='text-foreground bg-white group-hover:bg-background'
						/>
						{/* Shimmer effect on hover */}
						<span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
					</Button>
				</Link>
			</motion.div>
			
			{/* Optimized scroll indicator with CSS animation */}
			<a
				href='#description'
				className='absolute bottom-14 left-1/2 -translate-x-1/2 float-animation'
				aria-label='Scroll down to description'
			>
				<svg
					className='w-6 h-6 text-foreground/80 hover:text-primary transition-colors duration-300'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeWidth={1.5}
						d='M19 14l-7 7m0 0l-7-7m7 7V3'
					/>
				</svg>
			</a>
		</section>
	);
};
