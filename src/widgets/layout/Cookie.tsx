'use client';

import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { Text } from '@/components/ui/text-client';

export const Cookie = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const allow = getCookie('allow-cookies');
		if (!allow) {
			// Delay showing cookie consent to not affect LCP
			setTimeout(() => setIsVisible(true), 2000);
		}
	}, []);

	const acceptCookies = () => {
		setCookie('allow-cookies', 'true', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
		setIsVisible(false);
	};

	const declineCookies = () => {
		// Optionally set a decline cookie or just don't set allow cookie
		setCookie('allow-cookies', 'false', {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 days, user can be asked again later
		});
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className='fixed bottom-3 left-3 right-3 z-50 contain-content'>
			<div className='max-w-4xl mx-auto bg-background/60 backdrop-blur-lg border-b border-white/20 p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg'>
				<div className='text-sm text-muted-foreground flex-1'>
					<p>
						<Text text='layout.cookie.message' />
						<Link
							href={`/cookie-policy`}
							className='text-primary hover:underline underline-offset-4 font-medium'
						>
							<Text text='layout.cookie.policy' />
						</Link>
					</p>
				</div>
				<div className='flex gap-3 shrink-0'>
					<button
						onClick={declineCookies}
						className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-white/10 rounded-lg hover:bg-white/5'
					>
						<Text text='layout.cookie.decline' />
					</button>
					<button
						onClick={acceptCookies}
						className='px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
					>
						<Text text='layout.cookie.accept' />
					</button>
				</div>
			</div>
		</div>
	);
};
