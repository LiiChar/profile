import { getProjects } from '@/action/project/getProjects';
import { BlockIntersection } from '@/components/animation/BlockIntersection';
import { Description } from '@/widgets/main/Description';
import { Hero } from '@/widgets/main/Hero';
import { Knowledge } from '@/widgets/main/Knowledge';
import { LinePortfolio } from '@/widgets/main/LinePortfolio';
import { Navigation } from '@/widgets/main/Navigation';
import Projects from '@/widgets/main/Projects';

export default async function Home() {
	const projects = await getProjects();
	return (
		<main className='min-h-screen bg-background px-6 py-12'>
			<Navigation>
				<BlockIntersection id='hero' height={1000}>
					<Hero />
				</BlockIntersection>
				<BlockIntersection id='description' height={1000}>
					<Description />
				</BlockIntersection>
				<BlockIntersection id='knowledge' height={1000}>
					<Knowledge />
				</BlockIntersection>
				<BlockIntersection id='portfolio' height={1200}>
					<LinePortfolio projects={projects} />
				</BlockIntersection>
				<BlockIntersection id='projects' height={400}>
					<Projects />
				</BlockIntersection>
			</Navigation>
		</main>
	);
}
