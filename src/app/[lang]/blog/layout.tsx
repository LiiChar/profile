import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const title = getFromDict(dict, 'seo.blog.title');
	const description = getFromDict(dict, 'seo.blog.description');
	return {
		title,
		description,
		keywords: ['blog', 'articles', 'Максим Иванов', 'Maksim Ivanov', 'web development', 'programming', 'React', 'Next.js'],
		openGraph: {
			title,
			description,
			url: `https://ivanov-maksim.vercel.app/${lang}/blog`,
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
			canonical: `https://ivanov-maksim.vercel.app/${lang}/blog`,
		},
	};
}

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
