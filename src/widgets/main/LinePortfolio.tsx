
'use client';

import { getProjects } from '@/action/project/getProjects';
import { ProjectType } from '@/db/tables/project';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Text } from '@/components/ui/text-client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const Portfolio = React.memo(() => {
	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [loading, setLoading] = useState(true);

	const reduceMotion = useReducedMotion();

	useEffect(() => {
		let cancelled = false;

		const loadProjects = async () => {
			try {
				const data = await getProjects();

				if (!cancelled) {
					setProjects(data.slice(0, 5));
				}
			} catch (error) {
				console.error('Failed to load projects:', error);
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		loadProjects();

		return () => {
			cancelled = true;
		};
	}, []);

	const animationProps = reduceMotion
		? {
				initial: false as const,
				whileInView: undefined,
				transition: { duration: 0 },
			}
		: {
				initial: { opacity: 0, y: 24 },
				whileInView: { opacity: 1, y: 0 },
				transition: {
					duration: 0.6,
					ease: 'easeOut' as const,
				},
			};

	return (
		<section
			id="portfolio"
			className="site-section contain-layout"
		>
			<div className="site-container">
				{/* Header */}
				<motion.header
					{...animationProps}
					viewport={{ once: true }}
					className="mb-12 md:mb-16"
				>
					<p className="site-eyebrow mb-4">
            <Text text="page.main.portfolio.eyebrow" />
            <span className="
                h-px w-8 bg-[var(--site-border)]
            " />

            <span>04 / 05</span>
					</p>

					<div className="
						flex flex-col gap-5
						sm:flex-row sm:items-end
						sm:justify-between
					">
						<div>
							<h2 className="site-section-title">
								<Text text="page.main.portfolio.title" />
							</h2>

							<p className="site-section-description">
								<Text text="page.main.portfolio.subtitle" />
							</p>
						</div>

						<div className="
							flex shrink-0 items-center gap-3
							font-mono text-xs
							tracking-wider
							text-[var(--site-subtle)]
						">
							<span className="
								h-1.5 w-1.5 rounded-full
								bg-[var(--site-accent)]
							"/>

							<span>
								{String(projects.length).padStart(2, '0')} PROJECTS
							</span>
            </div>
					</div>
				</motion.header>

				{/* Projects */}
				{!loading && projects.length > 0 && (
					<div className="
						grid grid-cols-1 gap-5
						md:grid-cols-2
						md:gap-6
					">
						{projects.map((project, index) => {
							const featured = index === 0;

							return (
								<motion.article
									key={project.id}
									{...animationProps}
									viewport={{
										once: true,
										margin: '-70px',
									}}
									transition={{
										...animationProps.transition,
										delay: reduceMotion
											? 0
											: Math.min(index * 0.1, 0.4),
									}}
									className={`
										group relative min-w-0
										overflow-hidden rounded-xl
										border border-[var(--site-border)]
										bg-white/[0.015]
										transition-colors duration-300
										hover:border-[var(--site-accent)]/35
										hover:bg-white/[0.025]
										${featured ? 'md:col-span-2' : ''}
									`}
								>
									{/* Accent */}
									<div
										aria-hidden="true"
										className="
											absolute left-0 top-0 z-10
											h-12 w-px
											bg-[var(--site-accent)]
											opacity-40
											transition-all duration-300
											group-hover:h-20
											group-hover:opacity-100
										"
									/>

									{/* Project header */}
									<div className="
										flex items-center justify-between
										gap-4 px-5 pt-5
										sm:px-7 sm:pt-6
									">
										<div className="flex items-center gap-3">
											<span className="
												font-mono text-xs
												tabular-nums tracking-widest
												text-[var(--site-accent)]
											">
												{String(index + 1).padStart(2, '0')}
											</span>

											<span className="
												h-px w-7
												bg-[var(--site-border)]
											"/>

											<span className="
												font-mono text-[10px]
												uppercase tracking-[0.16em]
												text-[var(--site-subtle)]
											">
												{featured ? 'Featured project' : 'Selected project'}
											</span>
										</div>

										<ArrowUpRight
											aria-hidden="true"
											className="
												h-4 w-4 shrink-0
												text-[var(--site-subtle)]
												transition-all duration-300
												group-hover:-translate-y-0.5
												group-hover:translate-x-0.5
												group-hover:text-[var(--site-accent)]
											"
										/>
									</div>

									{/* Card */}
									<div className="
										min-w-0 p-3
										sm:p-4
									">
										<ProjectCard
											project={project}
											className="
												transition-transform
												duration-300
												group-hover:-translate-y-0.5
											"
										/>
									</div>

									{/* Bottom decoration */}
									<div className="
										mx-5 h-px
										bg-gradient-to-r
										from-[var(--site-accent)]/30
										via-[var(--site-border)]
										to-transparent
										opacity-50
										sm:mx-7
									"/>
								</motion.article>
							);
						})}
					</div>
				)}

				{/* Empty state */}
				{!loading && projects.length === 0 && (
					<div className="
						rounded-xl border
						border-[var(--site-border)]
						bg-white/[0.015]
						px-6 py-16 text-center
					">
						<p className="
							text-sm text-[var(--site-muted)]
						">
							Проекты пока не добавлены.
						</p>
					</div>
				)}
			</div>
		</section>
	);
});

Portfolio.displayName = 'LinePortfolio';
