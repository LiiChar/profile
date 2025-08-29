'use client';

import { Text } from '@/components/ui/text-client';
import { getText } from '@/helpers/i18n-client';
import { useDictionaryStore } from '@/stores/lang/langStore';
import { useRef } from 'react';

export const Description = () => {
	const dict = useDictionaryStore(state => state.dictionary);
	const wrapperRef = useRef<HTMLDivElement>(null);
	return (
		// <section className=' h-[calc(100vh-100px)] flex flex-col justify-center'>
		<section className='' ref={wrapperRef}>
			<h2 className='mb-8'>
				<Text text='page.main.description.title' />
			</h2>
			{/* <ScrollReveal baseOpacity={0}> */}
			{getText('page.main.description.paragraf1', dict!) +
				'\n\n' +
				getText('page.main.description.paragraf2', dict!)}
			{/* </ScrollReveal> */}

			{/* <p className='text-foreground'>
				<Text text='page.main.description.paragraf1' />
			</p>
			<p className='text-foreground'>
				<Text text='page.main.description.paragraf2' />
			</p> */}
		</section>
	);
};
