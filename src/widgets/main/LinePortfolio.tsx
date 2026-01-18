'use client';

import { getProjects } from '@/action/project/getProjects';
import { ProjectType } from '@/db/tables/project';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectCard } from '@/components/project/ProjectCard';
import { throttle, useReducedMotion } from '@/hooks/useReducedMotion';
import { Text } from '@/components/ui/text-client';

// Красивая S-образная линия с изгибами
const MAIN_PATH = `
	M300 60
	C150 120, 450 200, 300 280
	C150 360, 450 440, 300 520
	C150 600, 450 680, 300 760
	C150 840, 450 920, 300 1000
	C150 1080, 450 1160, 300 1240
`;

// Декоративные ответвления
const BRANCH_PATHS = [
	'M300 280 C380 300, 420 350, 440 400',
	'M300 280 C220 300, 180 350, 160 400',
	'M300 520 C380 540, 430 590, 460 650',
	'M300 520 C220 540, 170 590, 140 650',
	'M300 760 C380 780, 420 830, 440 890',
	'M300 760 C220 780, 180 830, 160 890',
	'M300 1000 C380 1020, 430 1070, 460 1130',
	'M300 1000 C220 1020, 170 1070, 140 1130',
];

// Точки на линии (0-1)
const POINT_T = [0.1, 0.28, 0.46, 0.64, 0.82];

const CARD_W = 340;
const GAP = 70;
const OFFSET = 0.35;

export const LinePortfolio = React.memo(() => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const rafRef = useRef<number>(null);

	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [progress, setProgress] = useState(0);
	const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
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
	useEffect(() => {
		if (!pathRef.current) return;

		const length = pathRef.current.getTotalLength();
		setTotalLength(length);

		const pts = POINT_T.map(t => {
			const p = pathRef.current!.getPointAtLength(length * t);
			return { x: p.x, y: p.y };
		});

		setPoints(pts);
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
			style={{ height: 1400 }}
		>
			<h2 className='mb-28 text-center'>
				<Text text='page.main.portfolio.title' />
			</h2>

			<svg
				className='absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none'
				width={600}
				height={1300}
				viewBox='0 0 600 1300'
			>
				<defs>
					{/* Градиент для линии */}
					<linearGradient id='lineGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
						<stop offset='0%' stopColor='var(--primary)' stopOpacity='0.3' />
						<stop offset='50%' stopColor='var(--primary)' stopOpacity='1' />
						<stop offset='100%' stopColor='var(--primary)' stopOpacity='0.3' />
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

				{/* Фоновая линия */}
				<path
					d={MAIN_PATH}
					fill='none'
					stroke='var(--primary)'
					strokeWidth={2}
					strokeOpacity={0.1}
				/>

				{/* Декоративные ответвления с анимацией прозрачности */}
				{BRANCH_PATHS.map((d, i) => {
					const branchProgress = Math.floor(i / 2);
					const branchActive = drawnLength >= POINT_T[branchProgress] * totalLength;
					
					return (
						<path
							key={i}
							d={d}
							fill='none'
							stroke='var(--primary)'
							strokeOpacity={branchActive ? 0.25 : 0.08}
							strokeWidth={1.5}
							strokeLinecap='round'
							style={{ transition: 'stroke-opacity 0.5s ease' }}
						/>
					);
				})}

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

			{/* Карточки с перекрытием линии */}
			{points.map((p, i) => {
				if (!projects[i]) return null;

				const active = drawnLength >= POINT_T[i] * totalLength;
				const isLeft = i % 2 === 0;
				
				// Смещаем карточки ближе к линии для эффекта перекрытия
				const left = isLeft
					? `calc(50% - ${CARD_W + GAP - 30}px)`
					: `calc(50% + ${GAP - 30}px)`;
				const translateX = isLeft ? '30px' : '-30px';

				return (
					<div
						key={projects[i].id}
						className="contain-layout"
						style={{
							position: 'absolute',
							top: p.y + 70,
							left,
							width: CARD_W,
							transform: `translateY(-50%) translateX(${active ? '0' : translateX}) scale(${active ? 1 : 0.92}) rotate(${active ? 0 : isLeft ? -2 : 2}deg)`,
							opacity: active ? 1 : 0,
							pointerEvents: active ? 'auto' : 'none',
							transition: reduceMotion 
								? 'opacity 0.1s ease' 
								: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
							zIndex: 20,
							willChange: 'transform, opacity',
						}}
					>
						<ProjectCard className='hover-lift shadow-lg hover:shadow-2xl transition-shadow duration-300' project={projects[i]} />
					</div>
				);
			})}
		</div>
	);
});

LinePortfolio.displayName = 'LinePortfolio';
