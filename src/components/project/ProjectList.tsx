'use client';
import { ProjectType } from '@/db/tables/project';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Reorder } from 'motion/react';
import { useSticky } from '@/hooks/useSticky';
import { motion, AnimatePresence } from 'framer-motion';

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

	const scrollRef = useRef<HTMLDivElement>(null);
	const pauseRef = useRef(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// авто-скролл
	useEffect(() => {
		if (!isSticky || !scrollRef.current) return;
		let frame: number;
		const el = scrollRef.current;

		const step = () => {
			if (el && !pauseRef.current) {
				el.scrollLeft += 0.5; // скорость
				if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
					el.scrollLeft = 0;
				}
			}
			frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, [isSticky]);

	// wheel → только горизонтальный скролл + автопауза
	const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		if (!scrollRef.current) return;
		e.preventDefault(); // запрещаем вертикальный скролл страницы
		scrollRef.current.scrollLeft += e.deltaY;

		// ставим паузу автоскролла
		pauseRef.current = true;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			pauseRef.current = false;
		}, 2000);
	};

	const tags = useMemo(() => {
		const tagsSet = new Set<string>();
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
		setCurrentTags(tag);
		const filteredProjectTag = projects.filter(p =>
			(p.tags ?? '').includes(tag)
		);
		setFilteredProjects(filteredProjectTag);
	};

	// Общий рендер кнопок
	const renderTags = () => (
		<>
			<div
				onClick={() => handleTagClick('')}
				className={cn(
					'px-2 py-1 border border-foreground/30 transition-all hover:bg-foreground hover:text-background rounded-md hover:scale-110 bg-background/30 h-min cursor-pointer text-nowrap',
					currentTag === '' && 'text-background bg-foreground'
				)}
			>
				All
			</div>
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

					{/* Sticky-фильтр с автоскроллом */}
					<AnimatePresence>
						{isSticky && (
							<motion.div
								ref={scrollRef}
								onWheel={handleWheel}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className={cn(
									'flex fixed top-[50px] h-[44px] left-1/2 -translate-x-1/2 gap-2 w-full flex-nowrap overflow-y-hidden overflow-x-scroll rounded-md z-10 overscroll-contain  max-w-[864px] scroll-smooth scrollbar-hide'
								)}
							>
								{renderTags()}
							</motion.div>
						)}
					</AnimatePresence>
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
