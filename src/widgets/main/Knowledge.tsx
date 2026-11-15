'use client';

import { Text } from '@/components/ui/text-client';
import { getFromDict } from '@/helpers/i18n-client';
import { useDictionary } from '@/stores/lang/langProvider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
	SiReact,
	SiNextdotjs,
	SiTypescript,
	SiNodedotjs,
	SiNestjs,
	SiLaravel,
	SiPhp,
	SiHtml5,
	SiCss,
	SiSqlite,
} from '@icons-pack/react-simple-icons';

type Knowledge = {
	icon: React.ReactNode;
	title: string;
	level: 'Эксперт' | 'Продвинутый' | 'Средний' | 'Ознакомлен';
	description: string;
	color: string;
};

const KnowledgeData: Knowledge[] = [
	{
		icon: <SiReact />,
		title: 'React',
		level: 'Эксперт',
		description:
			'Глубокое понимание жизненного цикла, хуков (useEffect, useMemo, custom hooks), Concurrent Mode, Suspense + React Query/TanStack Query, Server Components (RSC), оптимизация ререндеров через React.memo, Profiler, Concurrent Rendering. Создание масштабируемых дизайн-систем, интеграция с Zustand, Redux Toolkit, Context API.',
		color: '#0fdbfe',
	},
	{
		icon: <SiNextdotjs />,
		title: 'Next.js',
		level: 'Продвинутый',
		description:
			'Полное владение App Router (React 18+), Server Components, Server Actions, Streaming SSR, Partial Prerendering (PPR), Middleware, Route Handlers, динамический роутинг, параллельные маршруты, intercepting routes, Turbopack, оптимизация изображений (next/image), встроенный кэш и revalidation (ISR, SSR, SSG). Деплой на Vercel с preview-ветками.',
		color: 'var(--foreground)',
	},
	{
		icon: <SiTypescript />,
		title: 'TypeScript',
		level: 'Продвинутый',
		description:
			'Продвинутое использование: conditional types, infer, mapped types, template literal types, utility types, branded types. Работа с Zod, Yup, Valibot для runtime validation. tRPC + React Query для end-to-end type safety. Создание строгих, масштабируемых типов для монолитов и микросервисов. TypeScript + ESLint + Prettier в CI/CD.',
		color: '#3178c6',
	},
	{
		icon: <SiNodedotjs />,
		title: 'Node.js',
		level: 'Продвинутый',
		description:
			'Опыт построения высоконагруженных бэкендов на Express, Fastify (в 3–5 раз быстрее), работа с WebSocket (Socket.io, ws), создание REST/GraphQL API, микросервисная архитектура, очереди (BullMQ, Redis), rate limiting, кластеризация, потоковая обработка данных, интеграция с внешними API.',
		color: '#95ca56',
	},
	{
		icon: <SiNestjs />,
		title: 'NestJS',
		level: 'Средний',
		description:
			'Архитектура уровня enterprise: Dependency Injection, модульная структура, Guards, Interceptors, Pipes, Exception Filters, кастомные декораторы. GraphQL (Apollo + Code-first), WebSocket gateways, микросервисы (TCP, Redis, MQTT), интеграция с TypeORM, Prisma, Swagger (OpenAPI), Passport.js (JWT, OAuth2).',
		color: '#eb354e',
	},
	{
		icon: <SiLaravel />,
		title: 'Laravel',
		level: 'Средний',
		description:
			'Глубокое знание Eloquent ORM, Query Builder, миграции, сиды, фабрики, события/слушатели, очереди (Redis, Horizon), Laravel Octane (Swoole/RoadRunner), Nova + Filament админки, Laravel Sanctum + Passport, кэширование (Redis, Memcached), тестирование (Pest + PHPUnit), Livewire + Inertia.js.',
		color: '#f13e39',
	},
	{
		icon: <SiPhp />,
		title: 'PHP',
		level: 'Средний',
		description:
			'Современный PHP 8.1–8.3: атрибуты, enums, readonly классы, union types, match expression. Работа с Composer, PSR стандарты (PSR-12, PSR-4, PSR-7), Symfony компоненты (HttpFoundation, EventDispatcher), паттерны проектирования, чистый код, рефакторинг легаси, миграция с PHP 5.6 → 8.x.',
		color: '#9199c1',
	},
	{
		icon: <SiHtml5 />,
		title: 'HTML',
		level: 'Эксперт',
		description:
			'Семантическая разметка (article, section, nav, aside), микроразметка (Schema.org), доступность (ARIA: roles, labels, live regions), прогрессивное улучшение, работа с Canvas, SVG, Web Components, оптимизация для SEO и Core Web Vitals (LCP, CLS), поддержка старых браузеров через polyfills.',
		color: '#e75833',
	},
	{
		icon: <SiCss />,
		title: 'CSS',
		level: 'Эксперт',
		description:
			'Flexbox, Grid, Container Queries, :has(), каскадные слои (@layer), переменные (--css-vars), современные анимации (cubic-bezier, scroll-driven), Tailwind CSS (JIT, plugins), PostCSS, CSS-in-JS (styled-components, emotion), дизайн-системы, BEM/ITCSS, оптимизация под 60+ FPS.',
		color: '#2b6cb5',
	},
	{
		icon: <SiSqlite />,
		title: 'SQLite',
		level: 'Средний',
		description:
			'Использование в десктопных и мобильных приложениях (Tauri, Expo), миграции через Drizzle ORM и Prisma, интеграция с Next.js (в edge runtime), легковесные бэкенды, работа с JSON1 расширением, индексы, транзакции, оптимизация запросов, экспорт/импорт баз.',
		color: '#4ba5dc',
	},
];


const levelKeys: Record<Knowledge['level'], string> = {
	Эксперт: 'expert',
	Продвинутый: 'advanced',
	Средний: 'intermediate',
	Ознакомлен: 'familiar',
};

const skillGroups = [
	{
		id: 'frontend',
		titleKey: 'frontend',
		skills: ['React', 'Next.js', 'TypeScript'],
	},
	{
		id: 'backend',
		titleKey: 'backend',
		skills: ['Node.js', 'NestJS', 'Laravel', 'PHP', 'SQLite'],
	},
	{
		id: 'platform',
		titleKey: 'platform',
		skills: ['HTML', 'CSS'],
	},
] as const;

const levelProgress: Record<Knowledge['level'], number> = {
	Эксперт: 95,
	Продвинутый: 80,
	Средний: 62,
	Ознакомлен: 38,
};

const Knowledge = React.memo(() => {
	const [selected, setSelected] = useState<Knowledge | null>(null);
	const { dict } = useDictionary();
	const reduceMotion = useReducedMotion();

	const groupedSkills = useMemo(
		() =>
			skillGroups.map(group => ({
				...group,
				title: getFromDict(
					dict,
					`page.main.knowledge.groups.${group.titleKey}`,
				) as string,
				items: group.skills
					.map(title => KnowledgeData.find(skill => skill.title === title))
					.filter((skill): skill is Knowledge => Boolean(skill)),
			})),
		[dict],
	);

	const totalSkills = KnowledgeData.length;\n\tconst getLevelLabel = (level: Knowledge['level']) =>\n\t\tgetFromDict(dict, `page.main.knowledge.levels.${levelKeys[level]}`) as string;

	return (
		<section
			id='knowledge'
			className='site-section contain-layout'
		>
			<div className='site-container'>
				<motion.header
					initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{
						duration: reduceMotion ? 0 : 0.65,
						ease: 'easeOut',
					}}
					className='mb-10 text-center md:mb-14'
				>
					<h2 className='site-section-title'>
						<Text text='page.main.knowledge.title' />
					</h2>
					<div
						aria-hidden='true'
						className='mx-auto mt-3 h-px w-16 bg-[var(--site-foreground)]'
					/>
					<p className='site-section-description mx-auto'>
						<Text text='page.main.knowledge.subtitle' />
					</p>
				</motion.header>

				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{groupedSkills.map((group, groupIndex) => (
						<motion.section
							key={group.id}
							initial={reduceMotion ? {} : { opacity: 0, y: 22 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-60px' }}
							transition={{
								duration: reduceMotion ? 0 : 0.55,
								delay: reduceMotion ? 0 : groupIndex * 0.1,
								ease: 'easeOut',
							}}
							className='site-surface min-w-0 p-5 sm:p-6'
							aria-labelledby={`knowledge-${group.id}`}
						>
							<h3
								id={`knowledge-${group.id}`}
								className='mb-6 text-center text-base font-medium tracking-tight'
							>
								{group.title}
							</h3>

							<div className='space-y-4'>
								{group.items.map((skill, skillIndex) => (
									<button
										key={skill.title}
										type='button'
										onClick={() => setSelected(skill)}
										className='group/skill block w-full rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--site-surface)]'
										aria-label={`${skill.title}: ${getLevelLabel(skill.level)}. ${getFromDict(dict, 'page.main.knowledge.openDetails')}`}
									>
										<span className='mb-1.5 flex items-center justify-between gap-3 text-sm'>
											<span className='font-medium text-[var(--site-foreground)] transition-colors group-hover/skill:text-[var(--site-accent)]'>
												{skill.title}
											</span>
											<span className='shrink-0 text-xs text-[var(--site-muted)]'>
												{getLevelLabel(skill.level)}
											</span>
										</span>

										<span className='block h-1.5 overflow-hidden rounded-full bg-[var(--site-border)]'>
											<motion.span
												initial={reduceMotion ? false : { scaleX: 0 }}
												whileInView={{ scaleX: 1 }}
												viewport={{ once: true }}
												transition={{
													duration: reduceMotion ? 0 : 0.8,
													delay: reduceMotion ? 0 : 0.12 * skillIndex,
													ease: 'easeOut',
												}}
												className='block h-full origin-left rounded-full bg-[var(--site-accent)]'
												style={{
													width: `${levelProgress[skill.level]}%`,
												}}
											/>
										</span>
									</button>
								))}
							</div>
						</motion.section>
					))}
				</div>

				<motion.aside
					initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-60px' }}
					transition={{
						duration: reduceMotion ? 0 : 0.65,
						delay: reduceMotion ? 0 : 0.15,
					}}
					className='site-surface mx-auto mt-8 max-w-3xl px-5 py-7 text-center sm:px-8 sm:py-8'
				>
					<h3 className='text-lg font-medium tracking-tight'>
						<Text text='page.main.knowledge.overviewTitle' />
					</h3>
					<p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--site-muted)]'>
						<Text text='page.main.knowledge.overviewDescription' />
					</p>

					<div className='mt-6 flex flex-wrap items-center justify-center'>
						{groupedSkills.map((group, index) => (
							<div
								key={group.id}
								className={cn(
									'min-w-[110px] px-5 py-1',
									index > 0 && 'border-l border-[var(--site-border)]',
								)}
							>
								<p className='text-sm font-semibold tracking-wide'>
									{group.items.length.toString().padStart(2, '0')}
								</p>
								<p className='mt-1 text-xs text-[var(--site-muted)]'>
									{group.title}
								</p>
							</div>
						))}
					</div>

					<p className='mt-5 text-[11px] tracking-wide text-[var(--site-muted)]'>
						{totalSkills} <Text text='page.main.knowledge.skillsCountLabel' />
					</p>
				</motion.aside>
			</div>

			<AnimatePresence>
				{selected && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reduceMotion ? 0 : 0.2 }}
						className='fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm'
						onClick={() => setSelected(null)}
					>
						<motion.div
							role='dialog'
							aria-modal='true'
							aria-labelledby='knowledge-dialog-title'
							initial={
								reduceMotion
									? { opacity: 0 }
									: { scale: 0.96, y: 16, opacity: 0 }
							}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={
								reduceMotion
									? { opacity: 0 }
									: { scale: 0.96, y: 12, opacity: 0 }
							}
							transition={{
								type: reduceMotion ? 'tween' : 'spring',
								duration: reduceMotion ? 0.12 : undefined,
								stiffness: 300,
								damping: 28,
							}}
							onClick={event => event.stopPropagation()}
							className='site-surface relative max-h-[min(80vh,640px)] w-full max-w-lg overflow-y-auto p-6 shadow-2xl sm:p-8'
						>
							<button
								type='button'
								onClick={() => setSelected(null)}
								className='absolute right-4 top-4 rounded-md p-2 text-[var(--site-muted)] transition-colors hover:text-[var(--site-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)]'
								aria-label={String(
									getFromDict(dict, 'page.main.knowledge.close'),
								)}
							>
								<svg
									className='h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-hidden='true'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.8}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>

							<div className='mb-5 flex items-center gap-4 pr-8'>
								<div
									className='shrink-0 [&>svg]:h-8 [&>svg]:w-8'
									style={{ color: selected.color }}
									aria-hidden='true'
								>
									{selected.icon}
								</div>
								<div>
									<h3
										id='knowledge-dialog-title'
										className='text-xl font-semibold tracking-tight'
									>
										{selected.title}
									</h3>
									<p className='mt-1 text-xs text-[var(--site-muted)]'>
										{getLevelLabel(selected.level)}
									</p>
								</div>
							</div>

							<p className='text-sm leading-7 text-[var(--site-muted)]'>
								{selected.description}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
});

Knowledge.displayName = 'Knowledge';

export { Knowledge };
