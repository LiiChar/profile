
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { ProjectType } from '@/db/tables/project';
import { DEFAULT_IMAGE } from '@/const/image';
import { getUrl } from '@/helpers/url';
import { cn } from '@/lib/utils';

import { TagList } from '@/components/tag/TagList';
import { Content } from '../text/Content';

type ProjectCardProps = {
	project: ProjectType;
	limitTag?: number;
	link?: string;
} & React.HTMLAttributes<HTMLDivElement>;

type ProjectCardVariant = 'blur' | 'background';

type ProjectCardComponentProps = ProjectCardProps & {
	variant?: ProjectCardVariant;
};

const getProjectHref = (project: ProjectType) =>
	`/projects/${project.id}`;

const getProjectImage = (project: ProjectType) =>
	project.image ? getUrl(project.image) : DEFAULT_IMAGE;

export const ProjectCard = ({
	variant = 'blur',
	...props
}: ProjectCardComponentProps) => {
	return (
		<ProjectCardContent
			{...props}
			variant={variant}
		/>
	);
};

const ProjectCardContent = ({
	project,
	className,
	limitTag,
	link,
	variant,
	...props
}: ProjectCardProps & { variant: ProjectCardVariant }) => {
	const projectHref = link ?? getProjectHref(project);

	return (
		<article
			{...props}
			className={cn(
				'group/card flex min-w-0 flex-col',
				className,
			)}
		>
			{/* Cover */}
			<Link
				href={projectHref}
				aria-label={`Открыть проект ${project.title}`}
				className="
					group/image relative block
					aspect-[16/10] w-full
					overflow-hidden rounded-lg
					bg-[var(--site-border)]
					outline-none
					focus-visible:ring-2
					focus-visible:ring-[var(--site-accent)]
					focus-visible:ring-offset-2
					focus-visible:ring-offset-background
				"
			>
				<Image
					src={getProjectImage(project)}
					alt={project.title}
					fill
					sizes="
						(max-width: 640px) 100vw,
						(max-width: 1024px) 50vw,
						33vw
					"
					className="
						object-cover
						transition-transform duration-700
						ease-out
						group-hover/image:scale-105
					"
				/>

				{/* Overlay */}
				<div
					aria-hidden="true"
					className="
						absolute inset-0
						bg-gradient-to-t
						from-black/25 via-transparent
						to-transparent
						opacity-50
						transition-opacity duration-300
						group-hover/image:opacity-100
					"
				/>

				{/* Open icon */}
				<span
					aria-hidden="true"
					className="
						absolute bottom-3 right-3
						flex h-9 w-9 items-center
						justify-center rounded-full
						border border-white/20
						bg-black/30 text-white
						backdrop-blur-md
						opacity-0 translate-y-2
						transition-all duration-300
						group-hover/image:translate-y-0
						group-hover/image:opacity-100
					"
				>
					<ArrowUpRight className="h-4 w-4" />
				</span>
			</Link>

			{/* Content */}
			<div className="
				flex flex-1 flex-col
				pt-4 sm:pt-5
			">
				{/* Metadata */}
				<div className="
					flex flex-wrap items-center
					gap-x-3 gap-y-2
					font-mono text-[10px]
					uppercase tracking-[0.12em]
					text-[var(--site-subtle)]
				">
					<span>
						{variant === 'background'
							? 'Featured project'
							: 'Project'}
					</span>

					<span
						aria-hidden="true"
						className="
							h-1 w-1 rounded-full
							bg-[var(--site-accent)]/60
						"
					/>

					<span>
						{project.tags?.length ?? 0} technologies
					</span>
				</div>

				{/* Title */}
				<Link
					href={projectHref}
					className="
						mt-3 block w-fit
						outline-none
						focus-visible:underline
						focus-visible:decoration-[var(--site-accent)]
					"
				>
					<h3 className="
						text-lg font-semibold
						leading-snug tracking-tight
						text-[var(--site-foreground)]
						transition-colors duration-300
						group-hover/card:text-[var(--site-accent)]
						sm:text-xl
					">
						<Content data={project} field="title" />
					</h3>
				</Link>

				{/* Description */}
				<div className="
					mt-2 line-clamp-3
					text-sm leading-relaxed
					text-[var(--site-muted)]
				">
					{project.description ? (
						<p>{project.description}</p>
					) : (
						<Content data={project} field="content" />
					)}
				</div>

				{/* Footer */}
				<div className="
					mt-auto flex flex-wrap
					items-center justify-between
					gap-3 pt-5
				">
					<div className="min-w-0 flex-1">
						{project.tags && project.tags.length > 0 && (
							<TagList
								tags={project.tags}
								limit={limitTag ?? 3}
								prefix="#"
								separator=""
								className="flex flex-wrap gap-2"
							/>
						)}
					</div>

					<Link
						href={projectHref}
						className="
							group/read inline-flex shrink-0
							items-center gap-1.5
							whitespace-nowrap
							text-xs font-medium
							text-[var(--site-muted)]
							transition-colors duration-300
							hover:text-[var(--site-accent)]
							focus-visible:outline-none
							focus-visible:ring-2
							focus-visible:ring-[var(--site-accent)]
							focus-visible:ring-offset-2
						"
					>
						<span>View project</span>

						<ArrowUpRight className="
							h-3.5 w-3.5
							transition-transform duration-300
							group-hover/read:-translate-y-0.5
							group-hover/read:translate-x-0.5
						" />
					</Link>
				</div>
			</div>
		</article>
	);
};

ProjectCard.displayName = 'ProjectCard';
