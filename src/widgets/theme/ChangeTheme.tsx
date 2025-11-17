'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_THEME_KEY = 'theme';

export const ChangeTheme = () => {
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
		<div className='cursor-pointer'>
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
