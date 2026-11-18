
'use client';

import { Text } from '@/components/ui/text-client';
import { getFromDict } from '@/helpers/i18n-client';
import { useDictionary } from '@/stores/lang/langProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import {
	SiReact,
	SiNextdotjs,
	SiTypescript,
	SiJavascript,
	SiNodedotjs,
	SiNestjs,
	SiExpress,
	SiLaravel,
	SiPhp,
	SiHtml5,
	SiCss,
	SiTailwindcss,
	SiRedux,
	SiPostgresql,
	SiDocker,
	SiGit,
    SiStoryblok,
} from '@icons-pack/react-simple-icons';

type Knowledge = {
	icon: React.ReactNode;
	title: string;
	level: number;
	description: string;
	color: string;
};

const KnowledgeData: Knowledge[] = [
	// Frontend
	{
		icon: <SiReact />,
		title: 'React',
		level: 80,
		description:
			'Разработка интерактивных интерфейсов, функциональные компоненты, Hooks, Context API, управление состоянием, оптимизация ререндеров, React.memo, useMemo, useCallback, работа с жизненным циклом компонентов и собственными хуками.',
		color: '#61dafb',
	},
	{
		icon: <SiNextdotjs />,
		title: 'Next.js',
		level: 75,
		description:
			'App Router, Server и Client Components, SSR, SSG, ISR, динамическая маршрутизация, Route Handlers, Middleware, работа с серверными и клиентскими данными, оптимизация изображений и SEO.',
		color: 'var(--site-foreground)',
	},
	{
		icon: <SiTypescript />,
		title: 'TypeScript',
		level: 78,
		description:
			'Статическая типизация, интерфейсы, generics, utility types, unions, intersections, narrowing, type guards, работа с типизацией API, создание переиспользуемых типов и типизация сложных React-компонентов.',
		color: '#3178c6',
	},
	{
		icon: <SiJavascript />,
		title: 'JavaScript',
		level: 85,
		description:
			'ES6+, замыкания, прототипы, контекст this, Event Loop, Promise, async/await, обработка ошибок, асинхронное выполнение, работа с DOM, модули, структуры данных и основные алгоритмы.',
		color: '#f7df1e',
	},
	{
		icon: <SiTailwindcss />,
		title: 'Tailwind CSS',
		level: 85,
		description:
			'Разработка адаптивных интерфейсов, utility-first подход, responsive design, кастомизация конфигурации, работа с темами, CSS-переменными, анимациями и дизайн-системами.',
		color: '#38bdf8',
	},
	{
		icon: <SiStoryblok />,
		title: 'Zustand',
		level: 80,
		description:
			'Управление глобальным состоянием приложения, создание независимых хранилищ, selectors, actions, middleware, persist, разделение логики состояния и интеграция с React.',
		color: '#d9a066',
	},
	{
		icon: <SiRedux />,
		title: 'Redux Toolkit',
		level: 55,
		description:
			'Основы Redux, создание slices, reducers, actions, работа с configureStore, useSelector, useDispatch и организация централизованного управления состоянием.',
		color: '#764abc',
	},

	// Data fetching
	{
		icon: <SiReact />,
		title: 'TanStack Query',
		level: 60,
		description:
			'Работа с серверным состоянием, useQuery, useMutation, query keys, кэширование, инвалидация запросов, синхронизация данных, обработка загрузки и ошибок.',
		color: '#ff4154',
	},

	// Backend
	{
		icon: <SiNodedotjs />,
		title: 'Node.js',
		level: 70,
		description:
			'Асинхронная модель выполнения, Event Loop, работа с модулями, файловой системой, HTTP, обработка ошибок, создание серверных приложений и интеграция со сторонними API.',
		color: '#83cd29',
	},
	{
		icon: <SiExpress />,
		title: 'Express',
		level: 65,
		description:
			'Создание REST API, middleware, маршрутизация, обработка запросов и ошибок, подключение баз данных, валидация входящих данных и организация серверной архитектуры.',
		color: '#a3a3a3',
	},
	{
		icon: <SiNestjs />,
		title: 'NestJS',
		level: 60,
		description:
			'Модульная архитектура, Dependency Injection, Controllers, Providers, Services, Guards, Pipes, Interceptors, DTO, валидация данных и интеграция с базами данных.',
		color: '#e0234e',
	},
	{
		icon: <SiPhp />,
		title: 'PHP',
		level: 55,
		description:
			'Объектно-ориентированное программирование, работа с классами, интерфейсами, наследованием, обработка HTTP-запросов, Composer, интеграция с базами данных и поддержка существующих проектов.',
		color: '#777bb4',
	},
	{
		icon: <SiLaravel />,
		title: 'Laravel',
		level: 40,
		description:
			'Основы MVC, маршрутизация, контроллеры, Eloquent ORM, миграции, модели, middleware, работа с базами данных и создание серверной логики.',
		color: '#ff2d20',
	},
	{
		icon: <SiPostgresql />,
		title: 'PostgreSQL',
		level: 65,
		description:
			'Проектирование реляционных баз данных, SQL, JOIN, индексы, связи между таблицами, транзакции, ограничения, оптимизация запросов и интеграция с backend-приложениями.',
		color: '#4169e1',
	},

	// Tools
	{
		icon: <SiDocker />,
		title: 'Docker',
		level: 50,
		description:
			'Создание Dockerfile, работа с образами и контейнерами, Docker Compose, настройка окружения разработки, подключение баз данных и управление зависимостями сервисов.',
		color: '#2496ed',
	},
	{
		icon: <SiGit />,
		title: 'Git',
		level: 80,
		description:
			'Ведение истории изменений, branching, merging, rebase, cherry-pick, разрешение конфликтов, работа с удалёнными репозиториями и организация командной разработки.',
		color: '#f05032',
	},
	{
		icon: <SiHtml5 />,
		title: 'HTML',
		level: 90,
		description:
			'Семантическая разметка, доступность (ARIA), формы, SEO, метатеги, структурирование контента, работа с DOM и создание доступных интерфейсов.',
		color: '#e34f26',
	},
	{
		icon: <SiCss />,
		title: 'CSS',
		level: 90,
		description:
			'Flexbox, Grid, адаптивная вёрстка, CSS-анимации, transitions, псевдоклассы, CSS variables, media queries, работа с дизайн-системами и кроссбраузерная совместимость.',
		color: '#1572b6',
	},
];

const skillGroups = [
	{
		id: 'frontend',
		titleKey: 'frontend',
		skills: [
			'React',
			'Next.js',
			'TypeScript',
			'JavaScript',
			'Tailwind CSS',
			'Zustand',
			'Redux Toolkit',
			'TanStack Query',
			'HTML',
			'CSS',
		],
	},
	{
		id: 'backend',
		titleKey: 'backend',
		skills: [
			'Node.js',
			'Express',
			'NestJS',
			'PHP',
			'Laravel',
			'PostgreSQL',
		],
	},
	{
		id: 'tools',
		titleKey: 'tools',
		skills: ['Docker', 'Git'],
	},
] as const;

const animationProps = (reduceMotion: boolean) =>
	reduceMotion
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

const Knowledge = React.memo(() => {
	const [selected, setSelected] = useState<Knowledge | null>(null);

	const { dict } = useDictionary();
	const reduceMotion = useReducedMotion();

	const groups = useMemo(
		() =>
			skillGroups.map(group => ({
				...group,
				title: getFromDict(
					dict,
					`page.main.knowledge.groups.${group.titleKey}`,
				) as string,
				items: group.skills
					.map(title =>
						KnowledgeData.find(skill => skill.title === title),
					)
					.filter((skill): skill is Knowledge => Boolean(skill)),
			})),
		[dict],
	);

	return (
		<section id="knowledge" className="site-section contain-layout">
			<div className="site-container">
				{/* Heading */}
				<motion.div
					{...animationProps(reduceMotion)}
					viewport={{ once: true }}
					className="mb-12 md:mb-16"
				>
					<p className="site-eyebrow mb-4">
            <Text text="page.main.knowledge.eyebrow" />
            <span className="
                h-px w-8 bg-[var(--site-border)]
            " />

            <span>03 / 05</span>
					</p>


          <div className="
						flex flex-col gap-5
						sm:flex-row sm:items-end
						sm:justify-between
					">
						<div>
							<h2 className="site-section-title">
								<Text text="page.main.knowledge.title" />
							</h2>

							<p className="site-section-description">
								<Text text="page.main.knowledge.subtitle" />
							</p>
						</div>

						<div className="
							flex shrink-0 items-center gap-3 mb-1
							font-mono text-xs
							tracking-wider
							text-[var(--site-subtle)]
						">
							<span className="
								h-1.5 w-1.5 rounded-full
								bg-[var(--site-accent)]
							"/>

							<span>
								{KnowledgeData.length} SKILLS
							</span>
            </div>

					</div>
				</motion.div>

				{/* Skill groups */}
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
					{groups.map((group, groupIndex) => (
						<motion.section
							key={group.id}
							{...animationProps(reduceMotion)}
							viewport={{
								once: true,
								margin: '-60px',
							}}
							transition={{
								...animationProps(reduceMotion).transition,
								delay: reduceMotion ? 0 : groupIndex * 0.1,
							}}
							className="
								relative min-w-0 overflow-hidden
								rounded-xl border border-[var(--site-border)]
								bg-white/[0.015] p-5
								sm:p-7
							"
							aria-labelledby={`knowledge-${group.id}`}
						>
							{/* Group accent */}
							<div
								aria-hidden="true"
								className="
									absolute left-0 top-0 h-12 w-px
									bg-[var(--site-accent)] opacity-60
								"
							/>

							<div className="mb-7 flex items-center justify-between gap-3">
								<h3
									id={`knowledge-${group.id}`}
									className="text-lg font-semibold tracking-tight"
								>
									{group.title}
								</h3>

								<span className="
									font-mono text-xs tracking-wider
									text-[var(--site-subtle)]
								">
									{String(group.items.length).padStart(2, '0')} /{' '}
									{String(KnowledgeData.length).padStart(2, '0')}
								</span>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								{group.items.map((skill, skillIndex) => (
									<button
										key={skill.title}
										type="button"
										onClick={() => setSelected(skill)}
										aria-label={`${skill.title}: ${skill.level}%`}
										className="
											group/skill min-w-0 rounded-lg
											text-left outline-none
											focus-visible:ring-2
											focus-visible:ring-[var(--site-accent)]
											focus-visible:ring-offset-4
											focus-visible:ring-offset-[var(--site-background)]
										"
									>
										<div className="mb-3 flex items-center gap-3">
											<div
												className="
													flex h-9 w-9 shrink-0
													items-center justify-center
													rounded-lg border
													border-[var(--site-border)]
													bg-white/[0.025]
													transition-all duration-300
													group-hover/skill:border-[var(--site-accent)]/40
													group-hover/skill:bg-white/[0.05]
													[&>svg]:h-4 [&>svg]:w-4
												"
												style={{ color: skill.color }}
												aria-hidden="true"
											>
												{skill.icon}
											</div>

											<div className="min-w-0 flex-1">
												<p className="
													truncate text-sm font-medium
													transition-colors
													group-hover/skill:text-[var(--site-accent)]
												">
													{skill.title}
												</p>
											</div>

											<span className="
												shrink-0 font-mono text-xs
												tabular-nums
												text-[var(--site-muted)]
											">
												{skill.level}%
											</span>
										</div>

										<div
											className="
												h-1 overflow-hidden rounded-full
												bg-[var(--site-border)]
											"
											aria-hidden="true"
										>
											<motion.div
												initial={
													reduceMotion
														? false
														: { scaleX: 0 }
												}
												whileInView={{ scaleX: 1 }}
												viewport={{ once: true }}
												transition={{
													duration: reduceMotion ? 0 : 0.8,
													delay: reduceMotion
														? 0
														: skillIndex * 0.06,
													ease: 'easeOut',
												}}
												className="
													h-full origin-left rounded-full
													bg-[var(--site-accent)]
													opacity-80
													transition-opacity
													group-hover/skill:opacity-100
												"
												style={{
													width: `${skill.level}%`,
												}}
											/>
										</div>
									</button>
								))}
							</div>
						</motion.section>
					))}
				</div>


			</div>

			{/* Skill details */}
			<AnimatePresence>
				{selected && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: reduceMotion ? 0 : 0.2,
						}}
						className="
							fixed inset-0 z-[120]
							flex items-center justify-center
							bg-black/50 p-4 backdrop-blur-sm
						"
						onClick={() => setSelected(null)}
					>
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-labelledby="knowledge-dialog-title"
							initial={
								reduceMotion
									? { opacity: 0 }
									: { opacity: 0, scale: 0.96, y: 16 }
							}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={
								reduceMotion
									? { opacity: 0 }
									: { opacity: 0, scale: 0.96, y: 12 }
							}
							transition={{
								type: reduceMotion ? 'tween' : 'spring',
								stiffness: 300,
								damping: 28,
							}}
							onClick={event => event.stopPropagation()}
							className="
								relative w-full max-w-lg
								max-h-[min(80vh,640px)] overflow-y-auto
								rounded-xl border
								border-[var(--site-border)]
								bg-[var(--site-background)]
								p-6 shadow-2xl sm:p-8
							"
						>
							<button
								type="button"
								onClick={() => setSelected(null)}
								className="
									absolute right-4 top-4 rounded-lg p-2
									text-[var(--site-muted)]
									transition-colors
									hover:bg-white/[0.05]
									hover:text-[var(--site-foreground)]
									focus-visible:outline-none
									focus-visible:ring-2
									focus-visible:ring-[var(--site-accent)]
								"
								aria-label={String(
									getFromDict(
										dict,
										'page.main.knowledge.close',
									),
								)}
							>
								<X className="h-5 w-5" />
							</button>

							<div className="mb-6 flex items-center gap-4 pr-8">
								<div
									className="
										flex h-12 w-12 shrink-0
										items-center justify-center
										rounded-xl border
										border-[var(--site-border)]
										bg-white/[0.025]
										[&>svg]:h-6 [&>svg]:w-6
									"
									style={{ color: selected.color }}
									aria-hidden="true"
								>
									{selected.icon}
								</div>

								<div className="min-w-0 flex-1">
									<h3
										id="knowledge-dialog-title"
										className="text-xl font-semibold tracking-tight"
									>
										{selected.title}
									</h3>

									<p className="
										mt-1 font-mono text-xs
										text-[var(--site-accent)]
									">
										{selected.level}% / 100
									</p>
								</div>
							</div>

							<div className="
								mb-6 h-1.5 overflow-hidden rounded-full
								bg-[var(--site-border)]
							">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${selected.level}%` }}
									transition={{
										duration: reduceMotion ? 0 : 0.6,
									}}
									className="
										h-full rounded-full
										bg-[var(--site-accent)]
									"
								/>
							</div>

							<div className="
								border-t border-[var(--site-border)]
								pt-5
							">
								<p className="
									font-mono text-[10px] uppercase
									tracking-[0.16em]
									text-[var(--site-subtle)]
								">
									Описание навыка
								</p>

								<p className="
									mt-4 text-sm leading-7
									text-[var(--site-muted)]
								">
									{selected.description}
								</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
});

Knowledge.displayName = 'Knowledge';

export { Knowledge };
