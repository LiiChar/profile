'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Text } from '@/components/ui/text-client';
import { GrowArrow } from '@/components/ui/grow-arrow';
import { ContactModal } from '../modal/ContactModal';
import TextType from '@/components/ui/text-type';
import { getText } from '@/helpers/i18n-client';
import { useDictionaryStore } from '@/stores/lang/langStore';
import Link from 'next/link';

export const Hero = ({}) => {
	const dict = useDictionaryStore(state => state.dictionary);
	return (
		// <section className='mx-auto text-center h-[calc(100vh-40px)] flex flex-col justify-center items-center -mt-12 z-20'>
		<section className='mx-auto text-center h-full flex flex-col justify-center items-center z-20'>
			
			<motion.div
				animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
				className='absolute bottom-32 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10'
			/>
			<div className='relative'>
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className=' '
				>
					<Text text='page.main.hero.title' />
				</motion.h1>
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 1, delay: 0.6 }}
					className='mt-6 h-1 w-32 mx-auto bg-primary/60 rounded-full'
				/>
			</div>
			<div className='text-lg mt-5 md:text-xl mb-4 text-foreground/70 px-8'>
				<TextType text={[getText('page.main.hero.description', dict!)]} />
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.6 }}
				className='flex justify-center gap-4'
			>
				<ContactModal>
					<Button variant='outline' className='border-gray-600 text-foreground'>
						<Mail className='w-4 h-4 mr-2' />{' '}
						<Text text='page.main.hero.button2' />
					</Button>
				</ContactModal>
				<Link href={'/projects'}>
					<Button variant='default' className='group'>
						<Text text='page.main.hero.button1' />
						<GrowArrow variant='right' color='text-foreground bg-white' />
					</Button>
				</Link>
			</motion.div>
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className='absolute -bottom-40 left-1/2 -translate-x-1/2'
			>
				<svg
					className='w-6 h-6 text-foreground/30'
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
			</motion.div>
		</section>
	);
};
