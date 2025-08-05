import SwitchDetail from '@/components/ui/switch-detail';
import { defaultLocale } from '@/dictionaries/dictionaries';
import { updateLanugagePath } from '@/helpers/i18n';
import { Lang } from '@/types/i18n';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ChangeTheme } from '../theme/ChangeTheme';
import { Rounded } from '../../components/animation/rounded';
import { Text } from '@/components/ui/text-server';
import { cn } from '@/lib/utils';
import { ScrollProgressBorder } from './ScrollProgress';

export const Header = async () => {
	const headerList = await headers();
	const path = headerList.get('x-current-path');
	const lang = (headerList.get('x-current-language') || defaultLocale) as Lang;

	return (
		<header className='px-4 sticky top-0 z-50 pt-2'>
			<div className='flex justify-between'>
				<div className='flex items-center w-1/6'>
					<Link
						href={updateLanugagePath(lang == 'ru' ? 'en' : 'ru', path ?? '/')}
					>
						<SwitchDetail
							value={lang == 'ru'}
							className='w-14 h-6 text-[13px] text-foreground'
							variant='pill'
							first={'EN'}
							second={'RU'}
						/>
					</Link>
				</div>
				<div className='flex gap-4 items-center relative'>
					<div className='absolute  top-0 left-0 right-0 h-full w-full bg-secondary/20 backdrop-blur-[10px] scale-125 rounded-lg'>
						<ScrollProgressBorder />
					</div>
					<Link
						className={cn(
							'z-[60]',
							path?.split('/').includes('projects') && 'underline'
						)}
						href={'/projects'}
					>
						<Text text='layout.header.links.projects' />
					</Link>
					<Link className='z-[60]' href={'/'}>
						<Rounded className='w-8 h-8 hover:scale-110 transition-all'>
							Hi
						</Rounded>
					</Link>
					<Link
						className={cn(
							'z-[60]',
							path?.split('/').includes('blog') && 'underline'
						)}
						href={'/blog'}
					>
						<Text text='layout.header.links.blog' />
					</Link>
				</div>
				<div className='flex items-center z-10 justify-end gap-4 w-1/6'>
					<ChangeTheme />
				</div>
			</div>
		</header>
	);
};
