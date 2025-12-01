'use client';
import { LOCAL_STORAGE_THEME_KEY } from '@/const/theme';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';



type ChangeThemeProps = React.HTMLAttributes<HTMLDivElement>;

export const ChangeTheme = ({...attr}: ChangeThemeProps) => {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

	useEffect(() => {
		const currentTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
		if (currentTheme) {
			handleChangeTheme(currentTheme as 'light' | 'dark');
		} else {
			const media = window.matchMedia('(prefers-color-scheme: dark)');
			const theme = media.matches ? 'dark' : 'light';
			handleChangeTheme(theme);
		}
	}, []);

	const handleChangeTheme = (theme: 'light' | 'dark') => {
		// Cache body element to avoid repeated querySelector calls
		const body = document.body;

		if (theme === 'dark') {
			body.classList.add('dark');
			body.classList.remove('light');
		} else {
			body.classList.add('light');
			body.classList.remove('dark');
		}

		// Update localStorage and state
		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
		setTheme(theme);
	};

	return (
		<div {...attr} className={cn('cursor-pointer', attr.className)}>
			{theme == 'light' ? (
				<Moon
					className='hover:stroke-primary'
					onClick={() => handleChangeTheme('dark')}
				/>
			) : (
				<Sun
					className='hover:stroke-primary'
					onClick={() => handleChangeTheme('light')}
				/>
			)}
		</div>
	);
};
