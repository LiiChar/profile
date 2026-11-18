import { Blog } from '@/widgets/main/Blog';
import { Hero } from '@/widgets/main/Hero';
import { Portfolio } from '@/widgets/main/LinePortfolio';
import { Navigation } from '@/widgets/main/Navigation';
import { Lang } from '@/types/i18n';
import { Knowledge } from '@/widgets/main/Knowledge';
import { Experience } from '@/widgets/main/Experience';

export const dynamic = 'force-static';

export default async function Home({
	params,
}: {
	params: Promise<{ lang: Lang }>;
}) {
	const { lang } = await params;
	return (
		<main
			id='main-content'
			className='min-h-screen mt-[-88px] sm:px-6 space-y-12 '
		>
			<Navigation>
				<Hero />
				<Experience />
				<Knowledge />
				<Portfolio />
				<Blog lang={lang} />
			</Navigation>
		</main>
	);
}
