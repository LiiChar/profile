'use client';

import { Text } from '@/components/ui/text-client';
import TextType from '@/components/ui/text-type';
import { getText } from '@/helpers/i18n-client';
import { useDictionaryStore } from '@/stores/lang/langStore';

export const Description = () => {
	const dict = useDictionaryStore(state => state.dictionary);
	return (
		// <section className=' h-[calc(100vh-100px)] flex flex-col justify-center'>
		<section className=''>
			<h2 className=''>
				<Text text='page.main.description.title' />
			</h2>
			<TextType
				text={
					getText('page.main.description.paragraf1', dict!) +
					'\n\n' +
					getText('page.main.description.paragraf1', dict!)
				}
				typingSpeed={15}
			/>

			{/* <p className='text-foreground'>
				<Text text='page.main.description.paragraf1' />
			</p>
			<p className='text-foreground'>
				<Text text='page.main.description.paragraf2' />
			</p> */}
		</section>
	);
};
