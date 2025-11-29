'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { Text } from '@/components/ui/text-client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AutoScroll from 'embla-carousel-auto-scroll';
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

export const Knowledge = () => {
	const [selected, setSelected] = useState<Knowledge | null>(null);

	return (
		<div className='relative'>
			<h2 className='mb-10'>
				<Text text='page.main.knowledge.title' />
			</h2>

			<Carousel
				plugins={[
					AutoScroll({
						speed: 0.6,
						stopOnMouseEnter: true,
						stopOnInteraction: false,
						playOnInit: true,
					}),
				]}
				opts={{
					align: 'start',
					loop: true,
					dragFree: true,
				}}
				className='overflow-hidden'
			>
				<CarouselContent className='-ml-4'>
					{KnowledgeData.map(skill => (
						<CarouselItem
							key={skill.title}
							className='pl-4 basis-auto cursor-pointer select-none'
							onClick={() => setSelected(skill)}
						>
							<motion.div
								whileTap={{ scale: 0.95 }}
								className='relative group p-6 rounded-2xl dark:bg-card/50 bg-card/20 backdrop-blur-sm border border-border/50 overflow-hidden'
								style={{ minWidth: '140px' }}
							>
								{/* Градиентный фон при hover */}
								<motion.div
									className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
									style={{
										background: `radial-gradient(circle at 30% 30%, ${skill.color}20, transparent 70%)`,
									}}
								/>

								{/* Иконка */}
								<div className='relative z-10 flex flex-col -mb-4 items-center gap-3 py-4'>
									<div
										className='transition-transform  scale-140 group-hover:scale-150'
										style={{ color: skill.color }}
									>
										{skill.icon}
									</div>

									{/* Название — всегда видно, но с анимацией */}
									<AnimatePresence>
										<motion.span
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className='text-sm font-medium text-foreground/80'
										>
											{skill.title}
										</motion.span>
									</AnimatePresence>
								</div>

								{/* Уровень — маленький бейдж */}
								<div className='absolute top-0 right-1'>
									<span
										className={cn(
											'text-[10px] font-bold px-2 py-0.5 rounded-full',
											skill.level === 'Эксперт' &&
												'bg-emerald-500/20 text-emerald-400',
											skill.level === 'Продвинутый' &&
												'bg-blue-500/20 text-blue-400',
											skill.level === 'Средний' &&
												'bg-amber-500/20 text-amber-400'
										)}
									>
										{skill.level}
									</span>
								</div>
							</motion.div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Модальное окно с описанием при клике */}
			<AnimatePresence>
				{selected && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm'
						onClick={() => setSelected(null)}
					>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							onClick={e => e.stopPropagation()}
							className='relative max-w-md w-full bg-card rounded-3xl p-8 shadow-2xl border border-border'
						>
							<button
								onClick={() => setSelected(null)}
								className='absolute top-4 right-4 text-foreground/50 hover:text-foreground transition'
							>
								<svg
									className='w-6 h-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>

							<div className='flex items-center gap-4 mb-4'>
								<div style={{ color: selected.color }}>{selected.icon}</div>
								<h3 className='text-2xl font-bold'>{selected.title}</h3>
							</div>

							<div className='space-y-3 text-foreground/80'>
								<p className='text-sm'>
									<strong>Уровень:</strong>{' '}
									<span
										className={cn(
											selected.level === 'Эксперт' && 'text-emerald-400',
											selected.level === 'Продвинутый' && 'text-blue-400',
											selected.level === 'Средний' && 'text-amber-400'
										)}
									>
										{selected.level}
									</span>
								</p>
								<p className='text-sm leading-relaxed'>
									{selected.description}
								</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
