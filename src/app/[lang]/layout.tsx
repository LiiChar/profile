import { LangParams } from '@/types/i18n';
import './globals.css';
import '@/styles/highlight-js/github-dark.css';
import '@/styles/highlight-js/github.css';
import { Metadata } from 'next';
import { DictionaryProvider } from '@/stores/lang/langProvider';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Header } from '@/widgets/layout/Header';
import { Footer } from '@/widgets/layout/Footer';
import { InitProvider } from '@/widgets/layout/InitProvider';
import { Scroll } from '@/widgets/layout/Scroll';
import { TooltipProvider } from '@radix-ui/react-tooltip';

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
			<DictionaryProvider dict={await getDictionary((await params).lang)}>
				<body className='dark min-h-screen overflow-x-hidden relative z-[10]'>
					<InitProvider>
						<TooltipProvider delayDuration={100}>
							<Scroll />
							<Header />
							{children}
							<Footer />
						</TooltipProvider>
					</InitProvider>
				</body>
			</DictionaryProvider>
		</html>
	);
}
