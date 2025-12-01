import { ChangeTheme } from '../theme/ChangeTheme';
import { cn } from '@/lib/utils';
import { ScrollProgressBorder } from './ScrollProgress';
import { NavigationLinks } from './NavigationLinks';
import LanguageSwitcher from './ChangeLang';

export const Header = async () => {
	return (
		<header className='sticky top-0 z-50 w-full px-4 pt-4 pb-6' role='banner'>
			<div id='nav' className='mx-auto max-w-5xl'>
				<div
					className={cn(
						'relative overflow-hidden rounded-2xl border',
						'bg-background/20 backdrop-blur-xl',
						'border-white/10',
						'shadow-2xl shadow-black/20',
						'ring-1 ring-red-500/10', // тонкая красная аура
						'animate-in fade-in slide-in-from-top-6 duration-800 ease-out'
					)}
				>
					<div className='absolute inset-0 -z-10 opacity-30' aria-hidden='true'>
						<div className='absolute inset-x-0 top-0 h-full bg-gradient-to-b from-red-500/40 to-transparent blur-3xl' />
						<div className='absolute h-full inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-rose-600/20 blur-2xl' />
					</div>
					<ScrollProgressBorder className='z-[-1] w-full' targetId='nav'>
						<div className='relative flex items-center justify-between px-4 py-[3px] w-full'>
							<LanguageSwitcher/>
							<NavigationLinks />
							<ChangeTheme
								className='ransition-all duration-300 hover:scale-110'
								aria-label='Сменить тему'
							/>
						</div>
					</ScrollProgressBorder>
				</div>
			</div>
		</header>
	);
};
