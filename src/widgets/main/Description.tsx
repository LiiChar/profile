'use client';

import { Text } from '@/components/ui/text-client';
import { useRef } from 'react';

export const Description = () => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	return (
		// <section className=' h-[calc(100vh-100px)] flex flex-col justify-center'>
		<section className='' ref={wrapperRef}>
			<h2 className='mb-8'>
				<Text text='page.main.description.title' />
			</h2>
			{/* <ScrollReveal baseOpacity={0}> */}
			<p>
				<Text text='page.main.description.paragraf1' />
			</p>
			<p>
				<Text text='page.main.description.paragraf2' />
			</p>
			<p>
				<Text text='page.main.description.paragraf3' />
			</p>

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
