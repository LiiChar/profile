import { BlockIntersection } from '@/components/animation/BlockIntersection';
import { Description } from '@/widgets/main/Description';
import { Hero } from '@/widgets/main/Hero';
import { Navigation } from '@/widgets/main/Navigation';
import Portfolio from '@/widgets/main/Portfolio';
import Projects from '@/widgets/main/Projects';

export default async function Home() {
	return (
		<main className='min-h-screen bg-background px-6 py-12'>
			{/* <LightRays className='!absolute top-0 left-0 w-full h-full bg-transparent' /> */}
			<Navigation>
				<BlockIntersection id='hero' height={1000}>
					<Hero />
				</BlockIntersection>
				<BlockIntersection id='description' height={1000}>
					<Description />
				</BlockIntersection>
				<BlockIntersection id='projects' height={600}>
					<Portfolio />
				</BlockIntersection>
				<BlockIntersection id='portfolio' height={400}>
					<Projects />
				</BlockIntersection>
			</Navigation>
		</main>
	);
}

