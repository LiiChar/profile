'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Rounded } from '@/components/animation/rounded';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text-client';
import { PlusCircle } from 'lucide-react';

export const NavigationLinks = ({isAdmin}: {isAdmin?: boolean}) => {
	const pathname = usePathname();

	const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

	const isActive = (href: string): boolean => {
		const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');
		if (normalizedHref === '/') {
			return pathWithoutLocale === '/' || pathWithoutLocale === '';
		}
		return (
			pathWithoutLocale.startsWith(normalizedHref + '/') ||
			pathWithoutLocale === normalizedHref
		);
	};

	return (
		<nav className='flex items-center' aria-label='Основная навигация'>
			{isAdmin && (
				<>
					<Link
						href='/projects/create'
						className={cn(
							'relative transition-all uration-300 hover:scale-105'
						)}
					>
						<PlusCircle size={16} />
					</Link>

					<Separator
						orientation='vertical'
						className={cn(
							'!w-4 !h-[1px]',
							isActive('/projects') ? 'opacity-100' : 'opacity-0'
						)}
					/>
				</>
			)}

			<Link
				href='/projects'
				className={cn(
					'relative text-sm border-[1px] border-transparent font-medium transition-all p-1 rounded-md no-underline duration-300 hover:border-foreground',
					isActive('/projects') &&
						' border-foreground   hover:bg-foreground hover:text-background'
				)}
			>
				<Text text='layout.header.links.projects' />
			</Link>

			<Separator
				orientation='vertical'
				className={cn(
					'!w-4 !h-[1px]',
					isActive('/projects') ? 'opacity-100' : 'opacity-0'
				)}
			/>

			<Link href='/' className='flex items-center'>
				<Rounded
					className={cn(
						'h-10 w-10 flex items-center justify-center text-lg transition-all duration-500'
					)}
				>
					ᚺᛙ
				</Rounded>
			</Link>

			<Separator
				orientation='vertical'
				className={cn(
					'!w-4 !h-[1px]',
					isActive('/blog') ? 'opacity-100' : 'opacity-0'
				)}
			/>

			<Link
				href='/blog'
				className={cn(
					'relative text-sm border-[1px] border-transparent font-medium transition-all p-1 rounded-md no-underline duration-300 hover:border-foreground',
					isActive('/blog') &&
						' border-foreground hover:bg-foreground hover:text-background'
				)}
			>
				<Text text='layout.header.links.blog' />
			</Link>

			{isAdmin && (
				<>
					<Separator
						orientation='vertical'
						className={cn(
							'!w-4 !h-[1px]',
							isActive('/blog') ? 'opacity-100' : 'opacity-0'
						)}
					/>
					<Link
						href='/blog/create'
						className={cn(
							'relative transition-all uration-300 hover:scale-105'
						)}
					>
						<PlusCircle size={16} />
					</Link>
				</>
			)}
		</nav>
	);
};
