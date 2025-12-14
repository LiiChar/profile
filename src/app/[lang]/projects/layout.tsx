import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const title = getFromDict(dict, 'seo.projects.title');
	const description = getFromDict(dict, 'seo.projects.description');
	return {
		title,
		description,
		keywords: ['projects', 'portfolio', 'Максим Иванов', 'Maksim Ivanov', 'React', 'Next.js', 'web development'],
		openGraph: {
			title,
			description,
			url: `https://ivanov-maksim.vercel.app/${lang}/projects`,
			siteName: 'Maksim Ivanov Portfolio',
			locale: lang === 'en' ? 'en_US' : 'ru_RU',
			type: 'website',
		},
		twitter: {
			card: 'summary',
			title,
			description,
		},
		alternates: {
			canonical: `https://ivanov-maksim.vercel.app/${lang}/projects`,
		},
	};
}

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
