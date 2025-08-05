import React from 'react';
import { SiGithub, SiTelegram } from '@icons-pack/react-simple-icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export const Social = async () => {
	return (
        <>
        {/*<div className={'max-[980px]:hidden sticky bottom-0 left-[calc(25%-224px)] w-min'}>*/}
        {/*    <div className='flex gap-2 flex-col '>*/}
        {/*        <Link href={'https://github.com/LiiChar'} target='_blank'>*/}
        {/*            <SiGithub className='w-6 h-6 hover:fill-primary' />*/}
        {/*        </Link>*/}
        {/*        <Link href={'https://t.me/lLItaV'} target='_blank'>*/}
        {/*            <SiTelegram className='w-6 h-6 hover:fill-primary' />*/}
        {/*        </Link>*/}
        {/*        <div className='h-14  flex items-center justify-center '>*/}
        {/*            <Separator orientation='vertical' className='bg-foreground/50 w-[1px]' />*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*    <div className='sticky left-[calc(75%+224px)] bottom-0 w-min'>*/}
        {/*        <div className='text-sm '>*/}
        {/*            <Link*/}
        {/*                href={'mailto:LiiChaq@yandex.com'}*/}
        {/*                style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}*/}
        {/*            >*/}
        {/*                LiiChaq@yandex.com*/}
        {/*            </Link>*/}
        {/*        </div>*/}
        {/*        <div className='h-14  flex items-center justify-center'>*/}
        {/*            <Separator orientation='vertical' className='bg-foreground/50 w-[1px]' />*/}
        {/*        </div>*/}
        {/*    </div>*/}
		<div className='sticky bottom-0 z-0 mt-4  flex max-[980px]:items-center  flex-row justify-between w-full max-[980px]:static max-[980px]:-mb-3 -mb-0 max-[980px]:px-6 px-[calc((100%-896px)/4)] mx-auto'>
			<div className='flex gap-2 flex-col max-[980px]:flex-row max-[980px]:bg-background max-[980px]:px-3'>
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

			<div className=''>
				<div className='text-sm max-[980px]:hidden'>
					<Link
						href={'mailto:LiiChaq@yandex.com'}
						style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}
					>
						LiiChaq@yandex.com
					</Link>
				</div>
				<div className='text-sm max-[980px]:block hidden max-[980px]:bg-background max-[980px]:px-3'>
					<Link href={'mailto:LiiChaq@yandex.com'}>LiiChaq@yandex.com</Link>
				</div>
				<div className='h-4 w-full flex max-[980px]:hidden items-center justify-center'>
					<Separator orientation='vertical' className='' />
				</div>
			</div>
		</div>
        </>

	);
};
