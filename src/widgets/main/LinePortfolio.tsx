'use client';

import { getProjects } from '@/action/project/getProjects';
import { ProjectType } from '@/db/tables/project';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ProjectCard } from '@/components/project/ProjectCard';
import { throttle, useReducedMotion } from '@/hooks/useReducedMotion';
import { Text } from '@/components/ui/text-client';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 1400;

// Более извилистая "речная" линия с крупной амплитудой и меньшим числом изгибов
const MAIN_PATH = `
	M300 40
	C40 180, 560 280, 230 470
	C20 680, 560 780, 360 980
	C80 1160, 540 1240, 300 1360
`;

// Точки на линии (0-1)
const POINT_T = [0.1, 0.32, 0.54, 0.76, 0.92];

const CARD_LAYOUT = [
	{ side: 1, normal: 255, along: -30, shiftY: -20 },
	{ side: -1, normal: 275, along: 35, shiftY: -10 },
	{ side: 1, normal: 245, along: -25, shiftY: 15 },
	{ side: -1, normal: 285, along: 40, shiftY: 25 },
	{ side: 1, normal: 260, along: -20, shiftY: 35 },
];

const OFFSET = 0.35;

type PathPoint = {
	x: number;
	y: number;
	nx: number;
	ny: number;
	tx: number;
	ty: number;
};

export const LinePortfolio = React.memo(() => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const rafRef = useRef<number>(null);

	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [progress, setProgress] = useState(0);
	const [points, setPoints] = useState<PathPoint[]>([]);
	const [totalLength, setTotalLength] = useState(1);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		getProjects().then(data => setProjects(data.slice(0, 5)));
	}, []);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Получаем реальные координаты точек на линии
	useLayoutEffect(() => {
		if (!pathRef.current) return;

		let frameId = requestAnimationFrame(() => {
			if (!pathRef.current) return;
			const length = pathRef.current.getTotalLength();
			setTotalLength(length);

			const delta = Math.max(1, length * 0.0015);

			const pts = POINT_T.map(t => {
				const at = length * t;
				const p = pathRef.current!.getPointAtLength(at);
				const pPrev = pathRef.current!.getPointAtLength(Math.max(0, at - delta));
				const pNext = pathRef.current!.getPointAtLength(Math.min(length, at + delta));
				const rawTx = pNext.x - pPrev.x;
				const rawTy = pNext.y - pPrev.y;
				const norm = Math.hypot(rawTx, rawTy) || 1;
				const tx = rawTx / norm;
				const ty = rawTy / norm;
				const nx = -ty;
				const ny = tx;

				return {
					x: p.x,
					y: p.y,
					nx,
					ny,
					tx,
					ty,
				};
			});

			setPoints(pts);
		});

		return () => cancelAnimationFrame(frameId);
	}, []);

	const reduceMotion = useReducedMotion();

	const calculateProgress = useCallback(() => {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		const windowH = window.innerHeight;

		const start = windowH * 0.85;
		const end = -rect.height * 0.15;

		const p = (start - rect.top) / (start - end) - OFFSET;
		setProgress(Math.min(1, Math.max(0, p)));
	}, []);

	const onScroll = useCallback(() => {
		if (!containerRef.current) return;

		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}

		rafRef.current = requestAnimationFrame(calculateProgress);
	}, [calculateProgress]);

	// Throttled scroll handler for better mobile performance
	const throttledScroll = useMemo(
		() => throttle(onScroll, reduceMotion ? 100 : 16),
		[onScroll, reduceMotion]
	);

	useEffect(() => {
		window.addEventListener('scroll', throttledScroll, { passive: true });
		onScroll();

		return () => {
			window.removeEventListener('scroll', throttledScroll);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [throttledScroll, onScroll]);

	const drawnLength = useMemo(() => totalLength * progress, [totalLength, progress]);

	const mobilePoints = useMemo(() => POINT_T.map((_, i) => ({ x: 50, y: 200 + i * 275 })), []);

	if (isMobile) {
		return (
			<div
				ref={containerRef}
				id='portfolio'
				className='relative mr-6'
				style={{
					height: Math.max(1200, mobilePoints[mobilePoints.length - 1].y + 200),
				}}
			>
				<h2 className='mb-24 text-center'>
					<Text text='page.main.portfolio.title' />
				</h2>

				<div className='absolute left-6 top-24'>
					<svg
						width={20}
						height={mobilePoints[mobilePoints.length - 1].y + 100}
						viewBox={`0 0 20 ${mobilePoints[mobilePoints.length - 1].y + 100}`}
						className='overflow-visible'
					>
						{/* Фоновая линия */}
						<line
							x1={10}
							y1={0}
							x2={10}
							y2={mobilePoints[mobilePoints.length - 1].y + 50}
							stroke='var(--primary)'
							strokeWidth={2}
							strokeOpacity={0.15}
						/>
						{/* Прогресс линия */}
						<line
							x1={10}
							y1={0}
							x2={10}
							y2={mobilePoints[mobilePoints.length - 1].y + 50}
							stroke='var(--primary)'
							strokeWidth={3}
							strokeDasharray={mobilePoints[mobilePoints.length - 1].y + 50}
							strokeDashoffset={
								(mobilePoints[mobilePoints.length - 1].y + 50) * (1 - progress)
							}
							strokeLinecap='round'
							style={{ transition: 'stroke-dashoffset 0.1s linear' }}
						/>
						{mobilePoints.map((p, i) => {
							const active = progress >= i / (mobilePoints.length - 1);
							return (
								<g key={i}>
									{/* Пульсирующий круг */}
									<circle
										cx={10}
										cy={p.y - 50}
										r={active ? 12 : 8}
										fill={active ? 'var(--primary)' : 'transparent'}
										opacity={active ? 0.2 : 0}
										style={{ transition: 'all 0.4s ease' }}
									/>
									{/* Основной круг */}
									<circle
										cx={10}
										cy={p.y - 50}
										r={6}
										fill={active ? 'var(--primary)' : 'var(--background)'}
										stroke='var(--primary)'
										strokeWidth={2}
										style={{ transition: 'all 0.3s ease' }}
									/>
								</g>
							);
						})}
					</svg>
				</div>

				{/* Карточки мобильные */}
				{mobilePoints.map((p, i) => {
					if (!projects[i]) return null;

					const active = progress >= i / (mobilePoints.length - 1);

					return (
						<div
							key={projects[i].id}
							className="contain-layout"
							style={{
								position: 'absolute',
								top: p.y,
								left: '60px',
								width: `calc(100vw - 80px)`,
								maxWidth: '400px',
								transform: `translateY(-50%) ${active ? 'scale(1)' : 'scale(0.95)'}`,
								opacity: active ? 1 : 0,
								pointerEvents: active ? 'auto' : 'none',
								transition: reduceMotion 
									? 'opacity 0.1s ease' 
									: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
								zIndex: 10,
								willChange: 'transform, opacity',
							}}
						>
							<ProjectCard className='hover-lift' project={projects[i]} />
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			id='portfolio'
			className='relative'
			style={{ height: CANVAS_HEIGHT + 260 }}
		>
			<h2 className='mb-28 '>
				<Text text='page.main.portfolio.title' />
			</h2>

			<div
				className='absolute top-16 left-1/2 -translate-x-1/2 overflow-visible'
				style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
			>
				<svg
					className='absolute inset-0 pointer-events-none overflow-visible'
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
				>
					<defs>
						{/* Градиент для линии */}
						<linearGradient id='lineGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
							<stop offset='0%' stopColor='var(--primary)' stopOpacity='0.25' />
							<stop offset='50%' stopColor='var(--primary)' stopOpacity='1' />
							<stop offset='100%' stopColor='var(--primary)' stopOpacity='0.25' />
						</linearGradient>
						{/* Свечение */}
						<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
							<feGaussianBlur stdDeviation='4' result='coloredBlur' />
							<feMerge>
								<feMergeNode in='coloredBlur' />
								<feMergeNode in='SourceGraphic' />
							</feMerge>
						</filter>
					</defs>

					{/* Мягкий "русловой" фон */}
					<path
						d={MAIN_PATH}
						fill='none'
						stroke='var(--primary)'
						strokeWidth={12}
						strokeOpacity={0.06}
					/>

					{/* Фоновая линия */}
					<path
						d={MAIN_PATH}
						fill='none'
						stroke='var(--primary)'
						strokeWidth={2}
						strokeOpacity={0.12}
					/>

					{/* Основная линия с прогрессом */}
					<path
						ref={pathRef}
						d={MAIN_PATH}
						fill='none'
						stroke='url(#lineGradient)'
						strokeWidth={3}
						strokeLinecap='round'
						strokeDasharray={totalLength}
						strokeDashoffset={totalLength - drawnLength}
						filter='url(#glow)'
						style={{ transition: 'stroke-dashoffset 0.1s linear' }}
					/>

					{/* Точки на линии */}
					{points.map((p, i) => {
						const active = drawnLength >= POINT_T[i] * totalLength;

						return (
							<g key={i}>
								{/* Пульсирующий круг */}
								<circle
									cx={p.x}
									cy={p.y}
									r={active ? 18 : 10}
									fill='var(--primary)'
									opacity={active ? 0.15 : 0}
									style={{ transition: 'all 0.5s ease' }}
								/>
								{/* Средний круг */}
								<circle
									cx={p.x}
									cy={p.y}
									r={active ? 12 : 8}
									fill='var(--primary)'
									opacity={active ? 0.3 : 0}
									style={{ transition: 'all 0.4s ease' }}
								/>
								{/* Основной круг */}
								<circle
									cx={p.x}
									cy={p.y}
									r={8}
									fill={active ? 'var(--primary)' : 'var(--background)'}
									stroke='var(--primary)'
									strokeWidth={2}
									filter={active ? 'url(#glow)' : 'none'}
									style={{ transition: 'fill 0.3s ease' }}
								/>
								{/* Центральная точка */}
								<circle
									cx={p.x}
									cy={p.y}
									r={3}
									fill={active ? 'var(--background)' : 'var(--primary)'}
									style={{ transition: 'fill 0.3s ease' }}
								/>
							</g>
						);
					})}
				</svg>

				{/* Карточки, "привязанные" к траектории */}
				{points.map((p, i) => {
					if (!projects[i]) return null;

					const layout = CARD_LAYOUT[i] ?? {
						side: i % 2 === 0 ? 1 : -1,
						normal: 260,
						along: 0,
						shiftY: 0,
					};
					const side = layout.side ?? (i % 2 === 0 ? 1 : -1);
					const normalOffset = (layout.normal ?? 260) * side;
					const alongOffset = layout.along ?? 0;
					const baseX = p.x + p.nx * normalOffset + p.tx * alongOffset;
					const baseY =
						p.y + p.ny * normalOffset + p.ty * alongOffset + (layout.shiftY ?? 0);

					const active = drawnLength >= POINT_T[i] * totalLength;

					return (
						<div
							key={projects[i].id}
							className='contain-layout'
							style={{
								position: 'absolute',
								left: baseX,
								top: baseY,
								width: 'clamp(260px, 28vw, 340px)',
								transform: `translate(-50%, -50%) scale(${active ? 1 : 0.96})`,
								opacity: active ? 1 : 0,
								pointerEvents: active ? 'auto' : 'none',
								transition: reduceMotion
									? 'opacity 0.1s ease'
									: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
								zIndex: 20,
								willChange: 'transform, opacity',
							}}
						>
							<ProjectCard
								className='hover-lift shadow-lg hover:shadow-2xl transition-shadow duration-300'
								project={projects[i]}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
});

LinePortfolio.displayName = 'LinePortfolio';
