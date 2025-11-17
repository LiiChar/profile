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
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className=' '
			>
				<Text text='page.main.hero.title' />
			</motion.h1>

			{/*<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.6 }}
				className='text-lg md:text-xl mb-4 text-foreground/70'
			>
				<Text text='page.main.hero.description' />
			</motion.p> */}
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
		</section>
	);
};
