import { getProjects } from '@/action/project/getProjects';
import { BlockIntersection } from '@/components/animation/BlockIntersection';
import { Blog } from '@/widgets/main/Blog';
import { Description } from '@/widgets/main/Description';
import { Hero } from '@/widgets/main/Hero';
import { Knowledge } from '@/widgets/main/Knowledge';
import { LinePortfolio } from '@/widgets/main/LinePortfolio';
import { Navigation } from '@/widgets/main/Navigation';

export default async function Home() {
	const projects = await getProjects();
	return (
		<main className='min-h-screen  px-6 py-12'>
			<Navigation>
				<BlockIntersection id='hero' height={1000} className="mb-[40%]">
					<Hero />
				</BlockIntersection>
				<BlockIntersection id='description' height={800} className="mb-[40%]">
					<Description />
				</BlockIntersection>
				<BlockIntersection id='knowledge' height={800} className="mb-[40%]">
					<Knowledge />
				</BlockIntersection>
				<BlockIntersection id='portfolio' height={3000} className="mb-[40%]">
					<LinePortfolio projects={projects} />
				</BlockIntersection>
				<BlockIntersection id='blog' height={800} className="">
					<Blog />
				</BlockIntersection>
			</Navigation>
		</main>
	);
}
