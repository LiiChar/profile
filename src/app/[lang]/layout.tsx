import { LangParams } from '@/types/i18n';
import './globals.css';
import { Metadata } from 'next';
import { DictionaryProvider } from '@/stores/lang/langProvider';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Header } from '@/widgets/layout/Header';
import { Footer } from '@/widgets/layout/Footer';
import { Inter } from 'next/font/google';
import { InitProvider } from '@/widgets/layout/InitProvider';
import { Scroll } from '@/widgets/layout/Scroll';

const montserrat = Inter({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
});

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
		<html lang={(await params).lang} className={montserrat.className}>
			<DictionaryProvider dict={await getDictionary((await params).lang)}>
				<body className='dark min-h-screen overflow-x-hidden relative z-[10]'>
					<InitProvider>
						<Scroll />
						<Header />
						{children}
						<Footer />
					</InitProvider>
				</body>
			</DictionaryProvider>
		</html>
	);
}
