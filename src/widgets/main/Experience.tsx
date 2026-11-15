
'use client';

import { Text } from '@/components/ui/text-client';
import { getFromDict } from '@/helpers/i18n-client';
import { useDictionary } from '@/stores/lang/langProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';

type ExperienceItem = {
	position: string;
	company: string;
	website?: string;
	location?: string;
	date: string;
	description: string;
	responsibilities: string[];
};

export const Experience = () => {
	const { dict } = useDictionary();
	const reduceMotion = useReducedMotion();

	const rawPositions = getFromDict(
		dict,
		'page.main.experience.positions',
	);

	const positions: ExperienceItem[] = Array.isArray(rawPositions)
		? rawPositions
		: [];

	const animationProps = reduceMotion
		? {
				initial: false as const,
				whileInView: undefined,
				transition: { duration: 0 },
			}
		: {
				initial: { opacity: 0, y: 20 },
				whileInView: { opacity: 1, y: 0 },
				transition: { duration: 0.55, ease: 'easeOut' as const },
			};

	return (
		<section id="experience" className="site-section contain-layout">
			<div className="site-container">
				{/* Section heading */}
				<motion.div
					{...animationProps}
					viewport={{ once: true }}
					className="mb-12 md:mb-16"
				>
					<p className="site-eyebrow mb-4">
						<Text text="page.main.experience.eyebrow" />
					</p>

					<h2 className="site-section-title">
						<Text text="page.main.experience.title" />
					</h2>

					<p className="site-section-description">
						<Text text="page.main.experience.subtitle" />
					</p>
				</motion.div>

				{/* Experience timeline */}
				<div className="relative max-w-4xl">
					{/* Timeline line */}
					<div
						aria-hidden="true"
						className="
							absolute bottom-8 left-[7px] top-5
							w-px bg-gradient-to-b
							from-[var(--site-accent)]
							via-[var(--site-border)]
							to-transparent
							sm:left-[9px]
						"
					/>

					<div className="space-y-8 md:space-y-10">
						{positions.map((item, index) => {
							const website = item.website?.trim();
							const isValidWebsite =
								website && /^https?:\/\//i.test(website);

							const responsibilities = Array.isArray(
								item.responsibilities,
							)
								? item.responsibilities
								: [];

							return (
								<motion.article
									key={`${item.company}-${item.position}-${index}`}
									{...animationProps}
									viewport={{
										once: true,
										margin: '-80px',
									}}
									transition={{
										...animationProps.transition,
										delay: reduceMotion
											? 0
											: Math.min(index * 0.12, 0.36),
									}}
									className="group relative pl-8 sm:pl-12"
								>
									{/* Timeline marker */}
									<span
										aria-hidden="true"
										className="
											absolute left-0 top-7 z-10
											flex h-4 w-4 items-center
											justify-center rounded-full
											border border-[var(--site-accent)]
											bg-[var(--site-background)]
											transition-all duration-300
											group-hover:scale-125
											group-hover:shadow-[0_0_12px_var(--site-accent)]
											sm:left-[2px]
										"
									>
										<span
											className="
												h-1.5 w-1.5 rounded-full
												bg-[var(--site-accent)]
											"
										/>
									</span>

									{/* Card */}
									<div
										className="
											relative overflow-hidden
											rounded-xl
											border border-[var(--site-border)]
											bg-white/[0.015]
											p-5
											transition-all duration-300
											hover:border-[var(--site-accent)]/30
											hover:bg-white/[0.025]
											sm:p-7 md:p-8
										"
									>
										{/* Accent line */}
										<div
											aria-hidden="true"
											className="
												absolute left-0 top-0
												h-12 w-px
												bg-[var(--site-accent)]
												opacity-0 transition-opacity
												duration-300
												group-hover:opacity-100
											"
										/>

										{/* Header */}
										<div className="
											flex flex-col gap-4
											sm:flex-row sm:items-start
											sm:justify-between
										">
											<div className="min-w-0">
												{/* Date */}
												<div className="mb-3">
													<span
														className="
															inline-flex items-center
															rounded-md
															border border-[var(--site-border)]
															bg-white/[0.025]
															px-2.5 py-1
															font-mono text-xs
															tracking-wide
															text-[var(--site-accent)]
														"
													>
														{item.date}
													</span>
												</div>

												{/* Position */}
												<h3 className="
													text-xl font-semibold
													tracking-tight
													sm:text-2xl
												">
													{item.position}
												</h3>

												{/* Company */}
												{isValidWebsite ? (
													<a
														href={website}
														target="_blank"
														rel="noopener noreferrer"
														className="
															group/link mt-1.5
															inline-flex items-center gap-1
															text-sm font-medium
															text-[var(--site-muted)]
															transition-colors
															hover:text-[var(--site-accent)]
														"
													>
														{item.company}

														<ArrowUpRight
															aria-hidden="true"
															className="
																h-3.5 w-3.5
																transition-transform
																group-hover/link:-translate-y-0.5
																group-hover/link:translate-x-0.5
															"
														/>
													</a>
												) : (
													<p className="
														mt-1.5 text-sm font-medium
														text-[var(--site-muted)]
													">
														{item.company}
													</p>
												)}
											</div>

											{/* Location */}
											{item.location && (
												<div className="
													inline-flex shrink-0
													items-center gap-2
													rounded-lg
													border border-[var(--site-border)]
													px-3 py-2
													text-xs
													text-[var(--site-subtle)]
												">
													<MapPin
														aria-hidden="true"
														className="
															h-3.5 w-3.5
															text-[var(--site-accent)]
														"
													/>

													{item.location}
												</div>
											)}
										</div>

										{/* Description */}
										{item.description && (
											<p className="
												mt-6 max-w-2xl
												text-sm leading-7
												text-[var(--site-muted)]
												sm:text-base
											">
												{item.description}
											</p>
										)}

										{/* Responsibilities */}
										{responsibilities.length > 0 && (
											<div className="
												mt-6 border-t
												border-[var(--site-border)]
												pt-5
											">
												<p className="
													mb-4 font-mono
													text-[10px] uppercase
													tracking-[0.16em]
													text-[var(--site-subtle)]
												">
													Основные задачи
												</p>

												<ul className="grid gap-3">
													{responsibilities.map(
														(responsibility, responsibilityIndex) => (
															<li
																key={responsibilityIndex}
																className="
																	group/item flex
																	items-start gap-3
																	text-sm leading-6
																	text-[var(--site-muted)]
																"
															>
																<span
																	aria-hidden="true"
																	className="
																		mt-[9px] h-1.5 w-1.5
																		shrink-0 rounded-full
																		bg-[var(--site-accent)]
																		opacity-60
																		transition-opacity
																		group-hover/item:opacity-100
																	"
																/>

																<span>
																	{responsibility}
																</span>
															</li>
														),
													)}
												</ul>
											</div>
										)}
									</div>
								</motion.article>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};
