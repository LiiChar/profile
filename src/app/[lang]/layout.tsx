import { LangParams } from '@/types/i18n';
import { locales } from '@/const/i18n';
import './globals.css';

import { Metadata } from 'next';
import { DictionaryProvider } from '@/stores/lang/langProvider';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';
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
import { env } from '@/helpers/env.server';
import { Analytics } from '@vercel/analytics/next';
import { SITE_URL } from '@/const/url';

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const title = getFromDict(dict, 'seo.home.title');
	const description = getFromDict(dict, 'seo.home.description');
	return {
		title,
		description,
		verification: {
			google: process.env.GOOGLE_VERIFICATION,
		},
		keywords: [
			'Максим Иванов',
			'Maksim Ivanov',
			'Frontend Developer',
			'React',
			'Next.js',
			'TypeScript',
			'Web Developer',
			'Portfolio',
		],
		authors: [{ name: 'Maksim Ivanov' }],
		creator: 'Maksim Ivanov',
		openGraph: {
			title,
			description,
			url: `${SITE_URL}/${lang}`,
			siteName: 'Maksim Ivanov Portfolio',
			locale: lang === 'en' ? 'en_US' : 'ru_RU',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: '@LiiChar',
		},
		alternates: {
			canonical: `${SITE_URL}/${lang}`,
			languages: {
				en: `${SITE_URL}/en`,
				ru: `${SITE_URL}/ru`,
			},
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	};
};

export async function generateStaticParams() {
	return locales.map((lang) => ({
		lang,
	}));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
}> &
	LangParams) {
	const resolvedParams = await params;
	return (
		<html lang={resolvedParams.lang}>
			{env.DEV! || env.DEV !== 'true' ? (
				<>
					<Analytics />
					<SpeedInsights />
				</>
			) : ''}
			<Script src='https://js.puter.com/v2/' strategy='afterInteractive' />
			<Script
				id='structured-data'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Person',
						name: 'Maksim Ivanov',
						alternateName: 'LiiChar',
						jobTitle: 'Frontend Developer',
						url: SITE_URL,
						sameAs: ['https://github.com/LiiChar', 'https://t.me/lLItaV'],
						knowsAbout: [
							'React',
							'Next.js',
							'TypeScript',
							'Web Development',
							'Frontend Development',
						],
						address: {
							'@type': 'PostalAddress',
							addressLocality: 'Yekaterinburg',
							addressCountry: 'RU',
						},
					}),
				}}
			/>
			<DictionaryProvider
				dict={await getDictionary(resolvedParams.lang as 'en' | 'ru')}
				lang={resolvedParams.lang as 'en' | 'ru'}
			>
				<body className='dark min-h-screen overflow-x-hidden relative z-[10]'>
					<a
						href='#main-content'
						className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50'
					>
						Skip to main content
					</a>
					<InitProvider>
						<TooltipProvider delayDuration={100}>
							<Scroll />
							<Header />
							{children}
							<Footer />
							<Auth />
							<Cookie />
							{/* <Dither /> */}
						</TooltipProvider>
					</InitProvider>
				</body>
			</DictionaryProvider>
		</html>
	);
}
