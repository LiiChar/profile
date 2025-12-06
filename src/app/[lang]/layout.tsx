import { LangParams } from '@/types/i18n';
import './globals.css';

import { Metadata } from 'next';
import { DictionaryProvider } from '@/stores/lang/langProvider';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Header } from '@/widgets/layout/Header';
import { Footer } from '@/widgets/layout/Footer';
import { Cookie } from '@/widgets/layout/Cookie';
import { InitProvider } from '@/widgets/layout/InitProvider';
import { Scroll } from '@/widgets/layout/Scroll';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import Script from 'next/script';
import Dither from '@/components/background/Dither';
import { Auth } from '@/widgets/layout/Auth';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
	title: 'Профиль',
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
}> &
	LangParams) {
	return (
		<html lang={(await params).lang}>
			<SpeedInsights/>
			<Script src='https://js.puter.com/v2/' strategy='afterInteractive' />
			<DictionaryProvider dict={await getDictionary((await params).lang as 'en' | 'ru')}>
				<body className='dark min-h-screen overflow-x-hidden relative z-[10]'>
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
					>
						Skip to main content
					</a>
					<InitProvider>
						<TooltipProvider delayDuration={100}>
							<Scroll />
							<Header />
							{children}
							<Footer />
							<Auth/>
							<Cookie />
							<Dither />
						</TooltipProvider>
					</InitProvider>
				</body>
			</DictionaryProvider>
		</html>
	);
}
