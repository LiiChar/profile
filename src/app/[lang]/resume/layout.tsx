import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';
import { SITE_URL } from '@/const/url';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const title = getFromDict(dict, 'seo.resume.title');
	const description = getFromDict(dict, 'seo.resume.description');
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: `${SITE_URL}/${lang}/resume`,
			siteName: 'Maksim Ivanov Portfolio',
			locale: lang === 'en' ? 'en_US' : 'ru_RU',
			type: 'profile',
		},
		alternates: {
			canonical: `${SITE_URL}/${lang}/resume`,
		},
	};
}

export default function ResumeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
