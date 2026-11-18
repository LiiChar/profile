
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Monitor,
	LayoutDashboard,
	Book,
	Brain,
	BriefcaseBusiness,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Portal from '@/components/ui/portal';

const MainComponents = {
	hero: {
		title: 'Главная',
		icon: <Monitor className="h-5 w-5" />,
	},
	experience: {
		title: 'Опыт',
		icon: <BriefcaseBusiness className="h-5 w-5" />,
	},
	knowledge: {
		title: 'Навыки',
		icon: <Brain className="h-5 w-5" />,
	},
	portfolio: {
		title: 'Портфолио',
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	blog: {
		title: 'Блог',
		icon: <Book className="h-5 w-5" />,
	},
} as const;

type Components = typeof MainComponents;
type ComponentKey = keyof Components;

type NavigationProps = {
	components?: Partial<Components>;
};

export const Navigation = React.memo(
	({
		children,
		components = MainComponents,
	}: React.PropsWithChildren<NavigationProps>) => {
		const [currentSection, setCurrentSection] =
			useState<ComponentKey>('hero');

		const reduceMotion = useReducedMotion();

		const componentEntries = useMemo(
			() =>
				Object.entries(components) as [
					ComponentKey,
					Components[ComponentKey],
				][],
			[components],
		);

		const navigationId = React.useId();

		// Scroll to section
		const scrollToSection = useCallback(
			(id: ComponentKey) => {
				const element = document.getElementById(id);

				if (!element) return;

				element.scrollIntoView({
					behavior: reduceMotion ? 'instant' : 'smooth',
					block: 'start',
				});
			},
			[reduceMotion],
		);

		// Detect active section
		useEffect(() => {
			if (!componentEntries.length) return;

			const sectionElements = componentEntries
				.map(([key]) => ({
					key,
					element: document.getElementById(key),
				}))
				.filter(
					(
						item,
					): item is {
						key: ComponentKey;
						element: HTMLElement;
					} => item.element !== null,
				);

			if (!sectionElements.length) return;

			let frameId: number | null = null;

			const updateActiveSection = () => {
				frameId = null;

				const viewportHeight = window.innerHeight;
				const anchor = viewportHeight * 0.4;

				const isAtBottom =
					window.scrollY + viewportHeight >=
					document.documentElement.scrollHeight - 4;

				if (isAtBottom) {
					setCurrentSection(
						sectionElements[sectionElements.length - 1].key,
					);
					return;
				}

				let activeSection = sectionElements[0];
				let minDistance = Infinity;

				for (const section of sectionElements) {
					const rect = section.element.getBoundingClientRect();

					// Section contains the active viewport anchor.
					if (rect.top <= anchor && rect.bottom > anchor) {
						activeSection = section;
						minDistance = 0;
						break;
					}

					// Find the closest section if the anchor
					// is currently between two sections.
					const distance =
						rect.top > anchor
							? rect.top - anchor
							: anchor - rect.bottom;

					if (distance < minDistance) {
						minDistance = distance;
						activeSection = section;
					}
				}

				setCurrentSection((previous) =>
					previous === activeSection.key
						? previous
						: activeSection.key,
				);
			};

			const handleScroll = () => {
				if (frameId !== null) return;

				frameId = requestAnimationFrame(updateActiveSection);
			};

			updateActiveSection();

			window.addEventListener('scroll', handleScroll, {
				passive: true,
			});

			window.addEventListener('resize', handleScroll);

			return () => {
				window.removeEventListener('scroll', handleScroll);
				window.removeEventListener('resize', handleScroll);

				if (frameId !== null) {
					cancelAnimationFrame(frameId);
				}
			};
		}, [componentEntries]);

		return (
			<>
				{children}

				<Portal>
					<aside
						aria-label="Навигация по разделам"
						className="
							group fixed top-1/2 -translate-y-1/2 right-4 min-[980px]:right-[calc((100%-896px)/4)] translate-x-3 z-[100]
							hidden
							min-[980px]:flex
						"
					>
						<nav
							className="
								relative flex flex-col gap-1
								rounded-full
								border border-[var(--site-border)]
								bg-background/5
								p-1.5
								shadow-lg shadow-black/5
								backdrop-blur-xl
							"
						>
							{componentEntries.map(
								([key, { title, icon }]) => {
									const isActive = currentSection === key;

									return (
										<div
											key={key}
											className="group/nav relative"
										>
											{/* Tooltip */}
											<div
												aria-hidden="true"
												className="
													pointer-events-none absolute
													right-full top-1/2 z-20
													-translate-x-2 -translate-y-1/2
													whitespace-nowrap pr-3
													opacity-0
													transition-all duration-200
													group-hover/nav:translate-x-0
													group-hover/nav:opacity-100
													group-focus-within/nav:translate-x-0
													group-focus-within/nav:opacity-100
												"
											>
												<span
													className="
														block rounded-lg
														border border-[var(--site-border)]
														bg-background/90
														px-3 py-2
														text-xs font-medium
														text-foreground
														shadow-lg
														backdrop-blur-xl
													"
												>
													{title}
												</span>
											</div>

											{/* Navigation button */}
											<button
												type="button"
												onClick={() => scrollToSection(key)}
												aria-current={
													isActive ? 'location' : undefined
												}
												aria-label={`Перейти к разделу ${title}`}
												title={title}
												className={cn(
													'relative z-10 flex h-10 w-10',
													'items-center justify-center',
													'rounded-full outline-none',
													'transition-colors duration-200',
													'focus-visible:ring-2',
													'focus-visible:ring-[var(--site-accent)]',
													'focus-visible:ring-offset-2',
													'focus-visible:ring-offset-background',
													isActive
														? 'text-[var(--site-accent)]'
														: 'text-[var(--site-muted)] hover:text-foreground',
												)}
											>
												{/* Active indicator */}
												{isActive && (
													<motion.span
														layoutId={`navigation-marker-${navigationId}`}
														aria-hidden="true"
														className="
															absolute inset-0
															rounded-full
															border border-[var(--site-accent)]/30
															bg-[var(--site-accent)]/10
														"
														transition={{
															type: reduceMotion
																? 'tween'
																: 'spring',
															stiffness: 400,
															damping: 35,
															duration: reduceMotion
																? 0
																: undefined,
														}}
													/>
												)}

												<span
													className={cn(
														'relative z-10 transition-transform duration-200',
														isActive
															? 'scale-110'
															: 'group-hover/nav:scale-105',
													)}
												>
													{icon}
												</span>
											</button>
										</div>
									);
								},
							)}
						</nav>
					</aside>
				</Portal>
			</>
		);
	},
);

Navigation.displayName = 'Navigation';
