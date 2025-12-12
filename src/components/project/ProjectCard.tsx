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
				'relative rounded-lg text-white group overflow-hidden cursor-pointer',
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
					className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
				/>
			</div>

			<div className='absolute  inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-100 translate-y-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-0'>
				<a href={`/projects/${project.id}`}>
					<h2 className=' font-bold text-lg m-0 p-0 border-0 mb-4'>
						{project.title}
					</h2>
				</a>
			</div>

			{/* Контент, который появляется при наведении */}
			<div className='absolute  inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0'>
				<a href={`/projects/${project.id}`}>
					<h2 className=' font-bold m-0 p-0 border-0'>{project.title}</h2>
				</a>
				{project.description ? (
					<p className=' my-3'>{project.description}</p>
				) : (
					<p className='  line-clamp-3 my-3'>
						{project.content}
					</p>
				)}
				{project.tags && (
					<TagList
						limit={limitTag}
						variant='default'
						tags={project.tags}
						separator={''}
						tagStyle='text-white'
						prefix={''}
					/>
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
		<SpotlightCard {...props} className={cn('rounded-lg group', className)}>
			<CardBlur wallpaper={project.image ? getUrl(project.image) : undefined} className={'!h-full'}>
				<h4 className='text-xl'>
					{link ? (
						<Link
							href={link}
							passHref
							className={'group-hover:no-underline group-hover:text-primary'}
						>
							{project.title}
						</Link>
					) : (
						project.title
					)}
				</h4>
				{project.description ? (
					<p className=' my-3'>{project.description}</p>
				) : (
					<p className='line-clamp-3 my-3'>{project.content}</p>
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
