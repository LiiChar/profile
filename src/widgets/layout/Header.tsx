import SwitchDetail from '@/components/ui/switch-detail';
import { defaultLocale } from '@/dictionaries/dictionaries';
import { updateLanugagePath } from '@/helpers/i18n';
import { Lang } from '@/types/i18n';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ChangeTheme } from '../theme/ChangeTheme';
import { Text } from '@/components/ui/text-server';
import { cn } from '@/lib/utils';
import { ScrollProgressBorder } from './ScrollProgress';
import { Rounded } from '@/components/animation/rounded';

export const Header = async () => {
	const headerList = await headers();
	const path = headerList.get('x-current-path');
	const lang = (headerList.get('x-current-language') || defaultLocale) as Lang;

	return (
		<header className='px-4 sticky top-0 z-50 pt-2' role='banner'>
			<div className='flex justify-between'>
				<div className='flex items-center w-1/6'>
					<Link
						href={updateLanugagePath(lang == 'ru' ? 'en' : 'ru', path ?? '/')}
						aria-label={`Switch language to ${
							lang === 'ru' ? 'English' : 'Русский'
						}`}
					>
						<SwitchDetail
							value={lang == 'ru'}
							className='w-14 h-6 text-[13px] text-foreground'
							variant='pill'
							first={'EN'}
							second={'RU'}
							aria-label={`Current language: ${lang.toUpperCase()}`}
						/>
					</Link>
				</div>
				<nav
					id='nav'
					className='flex gap-4 items-center relative'
					role='navigation'
					aria-label='Main site navigation'
				>
					<div
						className='absolute top-0 left-0 right-0 h-full w-full bg-secondary/20 backdrop-blur-[10px] scale-125 rounded-lg'
						aria-hidden='true'
					>
						<ScrollProgressBorder />
					</div>
					<Link
						className={cn(
							'z-[60] px-[4px] no-underline py-[1px] border-[1px] border-transparent rounded-md hover:bg-foreground hover:text-background',
							path?.split('/').includes('projects') &&
								'bg-foreground text-background'
						)}
						href={'/projects'}
						aria-current={
							path?.split('/').includes('projects') ? 'page' : undefined
						}
					>
						<Text text='layout.header.links.projects' />
					</Link>
					<Link className='z-[60]' href={'/'} aria-label='Go to homepage'>
						<Rounded className='h-[30px] w-[30px]'>Hi</Rounded>
					</Link>
					<Link
						className={cn(
							'z-[60] px-[4px] no-underline py-[1px] border-[1px] border-transparent rounded-md hover:bg-foreground hover:text-background',
							path?.split('/').includes('blog') &&
								'bg-foreground text-background'
						)}
						href={'/blog'}
						aria-current={
							path?.split('/').includes('blog') ? 'page' : undefined
						}
					>
						<Text text='layout.header.links.blog' />
					</Link>
				</nav>
				<div className='flex items-center z-10 justify-end gap-4 w-1/6'>
					<ChangeTheme aria-label='Change color theme' />
				</div>
			</div>
		</header>
	);
};
