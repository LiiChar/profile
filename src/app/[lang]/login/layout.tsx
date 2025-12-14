import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const title = getFromDict(dict, 'seo.login.title');
	const description = getFromDict(dict, 'seo.login.description');
	return {
		title,
		description,
		robots: {
			index: false,
			follow: false,
		},
	};
}

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
