import { CardBlur } from '@/components/ui/card-blur';
import SpotlightCard from '@/components/ui/card-spotlight';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { Text } from '@/components/ui/text-client';
import { TextDict } from '@/types/i18n';
import { TagList } from '@/components/tag/TagList';

export default function Project() {
	return (
		// <section className='z-10 relative h-[calc(100vh-100px)] flex flex-col justify-center'>
		<section className='z-10 relative '>
			<h2 className='mb-8'>
				<Text text='page.main.projects.title' />
			</h2>
			<Carousel>
				<CarouselContent className='gap-4 ml-0 rounded-xl p-0'>
					{ProjectsItem &&
						Array.isArray(ProjectsItem) &&
						ProjectsItem.map(p => <ProjectItem key={p.id} project={p} />)}
				</CarouselContent>
			</Carousel>
		</section>
	);
}

type ProjectTags = 'React' | 'Zustand' | 'WS' | '@dnd-kit' | 'Interpreter';

type ProjectsItem = {
	id: number;
	title: TextDict;
	description: TextDict;
	tags: ProjectTags[];
};

export const ProjectItem = ({ project }: { project: ProjectsItem }) => {
	return (
		<CarouselItem className='max-w-[calc(50%-8px)] p-0 overflow-visible  transition-transform'>
			<SpotlightCard className='rounded-lg'>
				<CardBlur>
					<h4 className='text-xl '>
						<Text text={project.title} />
					</h4>
					<p className='text-foreground/70 text-sm'>
						<Text text={project.description} />
					</p>
					<TagList
						className={'flex gap-2 mt-4 flex-wrap text-sm text-gray-500'}
						tags={project.tags}
						prefix={'#'}
						separator={''}
					/>
				</CardBlur>
			</SpotlightCard>
		</CarouselItem>
	);
};

const ProjectsItem: ProjectsItem[] = [
	{
		id: 0,
		title: 'page.main.projects.items.0.title',
		description: 'page.main.projects.items.0.description',
		tags: ['React', 'Zustand', 'WS'],
	},
	{
		id: 1,
		title: 'page.main.projects.items.1.title',
		description: 'page.main.projects.items.1.description',
		tags: ['React', '@dnd-kit', 'Interpreter'],
	},
];
