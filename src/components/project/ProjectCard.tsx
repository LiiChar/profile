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
	link,
	...props
}: ProjectCardProps) => {
	return (
		<article
			{...props}
			className={cn(
				'group relative w-full overflow-hidden rounded-xl border border-[var(--site-border)] bg-[var(--site-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--site-subtle)] hover:shadow-lg hover:shadow-black/[0.04] dark:hover:shadow-black/20',
				className,
			)}
		>
			<Link
				href={link ?? `/projects/${project.id}`}
				className='flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--site-accent)] md:flex-row'
			>
				<div className='relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--site-surface-raised)] md:aspect-auto md:min-h-[220px] md:w-[38%]'>
					<Image
						src={project.image ? getUrl(project.image) : DEFAULT_IMAGE}
						alt={project.title}
						fill
						sizes='(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 560px'
						className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
					/>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100 md:bg-gradient-to-r'
					/>
				</div>

				<div className='flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 md:p-7'>
					<div className='mb-3 flex items-center justify-between gap-3'>
						<span className='font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--site-muted)]'>
							{String(project.id).padStart(2, '0')}
						</span>
						<span className='text-xs text-[var(--site-muted)] transition-colors group-hover:text-[var(--site-accent)]'>
							Открыть проект ↗
						</span>
					</div>

					<h2 className='m-0 border-0 p-0 text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--site-accent)] sm:text-2xl'>
						<Content data={project} field='title' />
					</h2>

					<div className='mt-3 line-clamp-3 text-sm leading-6 text-[var(--site-muted)]'>
						{project.description ? (
							project.description
						) : (
							<Content data={project} field='content' />
						)}
					</div>

					{project.tags && (
						<div className='mt-5 flex flex-wrap gap-2'>
							<TagList
								limit={limitTag ?? 4}
								variant='default'
								tags={project.tags}
								separator=''
								tagStyle='text-[var(--site-muted)]'
								prefix=''
							/>
						</div>
					)}
				</div>
			</Link>
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
