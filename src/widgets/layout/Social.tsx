import React from 'react';
import { SiGithub, SiTelegram } from '@icons-pack/react-simple-icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export const Social = async () => {
	return (
		<div className='sticky bottom-0 z-0 mt-4  flex max-[980px]:items-center  flex-row justify-between w-full max-[980px]:static max-[980px]:-mb-3 -mb-0 max-[980px]:px-6 px-[calc((100%-896px)/4)] min-[980px]:border-b mx-auto border-foreground/50'>
			<Separator className='min-[980px]:hidden !w-10' />
			<div className='flex gap-2 flex-col max-[980px]:flex-row  max-[980px]:px-3'>
				<Link href={'https://github.com/LiiChar'} target='_blank'>
					<SiGithub className='w-6 h-6 hover:fill-primary' />
				</Link>
				<Link href={'https://t.me/lLItaV'} target='_blank'>
					<SiTelegram className='w-6 h-6 hover:fill-primary' />
				</Link>
				<div className='h-full w-full flex items-center justify-center max-[980px]:hidden '>
					<Separator orientation='vertical' />
				</div>
			</div>
			<Separator className='min-[980px]:hidden' />
			<div className=''>
				<div className='text-sm max-[980px]:hidden'>
					<Link
						href={'mailto:LiiChaq@yandex.com'}
						style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}
					>
						LiiChaq@yandex.com
					</Link>
				</div>
				<div className='text-sm hidden max-[980px]:flex items-center max-[980px]:px-3'>
					<Link href={'mailto:LiiChaq@yandex.com'}>LiiChaq@yandex.com</Link>
				</div>
				<div className='h-4 w-full flex max-[980px]:hidden items-center justify-center'>
					<Separator orientation='vertical' className='' />
				</div>
			</div>
			<Separator className='min-[980px]:hidden !w-10' />
		</div>
	);
};
