'use client';
import { ProjectType } from '@/db/tables/project';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useMemo, useState } from 'react';
import { Reorder } from 'motion/react';
import { useSticky } from '@/hooks/useSticky';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';

type ProjectListVariant = 'grid' | 'column' | 'vertical' | 'column-2';

const style: Record<
	ProjectListVariant,
	{
		wrapper: string;
		item: string;
	}
> = {
	column: {
		wrapper: 'flex-col',
		item: '',
	},
	grid: {
		wrapper: 'flex-row flex-wrap gap-2',
		item: 'w-[calc(33%-8px)]',
	},
	vertical: {
		wrapper: 'flex-row',
		item: '',
	},
	'column-2': {
		wrapper: 'block gap-x-4 columns-auto sm:columns-2',
		item: 'mb-4 ',
	},
};

type ProjectListProps = {
	projects: ProjectType[];
	variant?: ProjectListVariant;
	filter?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectList = ({
	projects,
	variant = 'grid',
	filter = false,
	...attr
}: ProjectListProps) => {
	const [currentTag, setCurrentTags] = useState('');
	const [filteredProjects, setFilteredProjects] = useState(projects ?? []);
	const { ref, isSticky } = useSticky<HTMLDivElement>(0);

	const tags = useMemo(() => {
		const tagsSet = new Set<string>();
		tagsSet.add('All');
		projects.forEach(project => {
			if (project.tags) {
				project.tags
					.split(',')
					.filter(Boolean)
					.forEach(t => {
						tagsSet.add(t.trim());
					});
			}
		});
		return Array.from(tagsSet);
	}, [projects]);

	const handleTagClick = (tag: string) => {
		if (tag === 'All') {
			tag = '';
		}
		setCurrentTags(tag);
		const filteredProjectTag = projects.filter(p =>
			(p.tags ?? '').includes(tag)
		);
		setFilteredProjects(filteredProjectTag);
	};

	// Общий рендер кнопок
	const renderTags = () => (
		<>
			{tags.map(t => (
				<div
					onClick={() => handleTagClick(t)}
					className={cn(
						'px-2 py-1 border border-foreground/30 transition-all bg-background/30 hover:bg-foreground hover:text-background rounded-md hover:scale-110 backdrop-blur-[10px] h-min cursor-pointer text-nowrap',
						currentTag === t && 'text-background bg-foreground'
					)}
					key={t}
				>
					{t}
				</div>
			))}
		</>
	);

	return (
		<>
			{filter && (
				<>
					{/* Обычный фильтр (исчезает при липкости) */}
					<motion.div
						ref={ref}
						initial={{ opacity: 1 }}
						animate={{ opacity: isSticky ? 0 : 1 }}
						transition={{ duration: 0.3 }}
						className={cn(
							'flex gap-2 w-full flex-wrap mb-6 text-foreground h-min'
						)}
					>
						{renderTags()}
					</motion.div>

					<Carousel
						style={{ display: !isSticky ? 'none' : 'block' }}
						plugins={[
							AutoScroll({
								speed: 0.5,
								startDelay: 2000,
								playOnInit: true,
								stopOnMouseEnter: false,
								stopOnFocusIn: false,
								stopOnInteraction: false,
							}),
						]}
						opts={{
							align: 'start',
							dragFree: true,
							loop: true,
						}}
						orientation='horizontal'
						className='z-100 fixed w-full top-[80px] left-0'
					>
						<CarouselContent className='ml-2'>
							{tags.map(t => (
								<CarouselItem
									onClick={() => handleTagClick(t)}
									title={t}
									key={t}
									className='basis-[4%] min-w-auto mx-1 px-2 py-1 border border-foreground/30 transition-all bg-background/30 hover:bg-foreground hover:text-background rounded-md backdrop-blur-[10px] h-min cursor-pointer text-nowrap  z-100 relative select-none'
								>
									{t}
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</>
			)}

			<Reorder.Group
				values={filteredProjects}
				onReorder={setFilteredProjects}
				as='section'
				axis='y'
				{...attr}
				className={cn('flex', style[variant].wrapper, attr.className)}
			>
				{filteredProjects.map(project => (
					<Reorder.Item
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						as='div'
						layout
						value={project}
						key={project.id}
					>
						<ProjectCard
							link={`/projects/${project.id}`}
							limitTag={2}
							className={cn(style[variant].item)}
							variant='background'
							project={project}
						/>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</>
	);
};
