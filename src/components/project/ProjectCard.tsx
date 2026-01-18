import { ProjectType } from '@/db/tables/project';
import React from 'react';
import { CardBlur } from '@/components/ui/card-blur';
import { TagList } from '@/components/tag/TagList';
import SpotlightCard from '@/components/ui/card-spotlight';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getUrl } from '@/helpers/url';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '@/const/image';
import { Content } from '../text/Content';

type ProjectCardProps = {
	project: ProjectType;
	limitTag?: number;
	link?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectCard = ({
	variant = 'blur',
	...props
}: ProjectCardProps & { variant?: 'blur' | 'background' }) => {
	return (
		<>
			{variant == 'blur' && <ProjectBlur {...props} />}{' '}
			{variant == 'background' && <ProjectBackground {...props} />}
		</>
	);
};
const ProjectBackground = ({
	project,
	className,
	limitTag,
	...props
}: ProjectCardProps) => {
	return (
		<article
			{...props}
			className={cn(
				'relative rounded-lg text-white group overflow-hidden cursor-pointer hover-lift',
				className
			)}
		>
			{/* Блок с картинкой */}
			<div className='relative w-full max-h-[300px] overflow-hidden'>
				<Image
					src={project.image ? getUrl(project.image) : DEFAULT_IMAGE}
					alt={project.title}
					width={800}
					height={600}
					className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
				/>
				{/* Animated overlay */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
			</div>

			<div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-100 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:translate-y-0'>
				<a href={`/projects/${project.id}`}>
					<h2 className='font-bold text-lg m-0 p-0 border-0 mb-4'>
						<Content data={project} field='title' />
					</h2>
				</a>
			</div>

			{/* Контент, который появляется при наведении */}
			<div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 translate-y-6 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0'>
				<a href={`/projects/${project.id}`}>
					<h2 className='font-bold m-0 p-0 border-0 transition-colors duration-300 group-hover:text-primary'>
						<Content data={project} field='title' />
					</h2>
				</a>
				{project.description ? (
					<p className='my-3 transition-all duration-300 delay-75'>{project.description}</p>
				) : (
					<p className='line-clamp-3 my-3 transition-all duration-300 delay-75'>
						<Content data={project} field='content' />
					</p>
				)}
				{project.tags && (
					<div className='transition-all duration-300 delay-150'>
						<TagList
							limit={limitTag}
							variant='default'
							tags={project.tags}
							separator={''}
							tagStyle='text-white'
							prefix={''}
						/>
					</div>
				)}
			</div>
		</article>
	);
};

const ProjectBlur = ({
	project,
	className,
	limitTag,
	link,
	...props
}: ProjectCardProps) => {
	return (
		<SpotlightCard {...props} className={cn('rounded-lg group hover-scale', className)}>
			<CardBlur
				wallpaper={project.image ? getUrl(project.image) : undefined}
				className={'!h-full transition-all duration-300 group-hover:shadow-xl'}
			>
				<h4 className='text-xl transition-colors duration-300 group-hover:text-primary'>
					{link ? (
						<Link
							href={link}
							passHref
							className={'group-hover:no-underline group-hover:text-primary animated-underline'}
						>
							{project.title}
						</Link>
					) : (
						project.title
					)}
				</h4>			
				{project.description ? (
					<p className='my-3 text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90'>
						{project.description}
					</p>
				) : (
					<p className='line-clamp-3 my-3 text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90'>
						<Content data={project} field='content' />
					</p>
				)}
				{project.tags && (
					<TagList
						limit={limitTag ?? project.tags.length}
						className='flex gap-2 mt-4 flex-wrap text-sm text-gray-500'
						tags={project.tags}
						prefix='#'
						separator=''
					/>
				)}
			</CardBlur>
		</SpotlightCard>
	);
};
