import { Blog } from '@/widgets/main/Blog';
import { Description } from '@/widgets/main/Description';
import { Hero } from '@/widgets/main/Hero';
import { Knowledge } from '@/widgets/main/Knowledge';
import { LinePortfolio } from '@/widgets/main/LinePortfolio';
import { Navigation } from '@/widgets/main/Navigation';
import { Lang } from '@/types/i18n';

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
			className='min-h-screen mt-[-88px] px-6 space-y-12 '
		>
			<Navigation>
				<Hero />
				<Description />
				<Knowledge />
				<LinePortfolio />
				<Blog lang={lang} />
			</Navigation>
		</main>
	);
}
