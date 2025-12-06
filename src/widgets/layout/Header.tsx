import { ChangeTheme } from '../theme/ChangeTheme';
import { cn } from '@/lib/utils';
import { ScrollProgressBorder } from './ScrollProgress';
import { NavigationLinks } from './NavigationLinks';
import LanguageSwitcher from './ChangeLang';
import { getCurrentUser } from '@/action/auth/login';

export const Header = async () => {
	const user = await getCurrentUser();
	
	return (
		<header className='sticky top-0 z-50 w-full px-4 pt-4 pb-6' role='banner'>
			<div id='nav' className='mx-auto max-w-5xl'>
				<div
					className={cn(
						'relative overflow-hidden rounded-2xl border',
						'bg-background/20 backdrop-blur-xl',
						'border-white/10',
						'shadow-2xl shadow-black/20',
						'animate-in fade-in slide-in-from-top-6 duration-800 ease-out'
					)}
				>
					<ScrollProgressBorder className='z-[-1] w-full' targetId='nav'>
						<div className='relative flex items-center justify-between px-4 py-[3px] w-full'>
							<LanguageSwitcher />
							<NavigationLinks isAdmin={user?.isAdmin} />
							<ChangeTheme
								className='ransition-all duration-300 hover:scale-110'
								aria-label='Toggle theme'
							/>
						</div>
					</ScrollProgressBorder>
				</div>
			</div>
		</header>
	);
};
