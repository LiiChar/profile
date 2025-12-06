'use client';

import { getProjects } from '@/action/project/getProjects';
import { ProjectType } from '@/db/tables/project';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/project/ProjectCard';

type Point = { x: number; y: number };


export const LinePortfolio = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);
	const [projects, setProjects] = useState<ProjectType[]>([]);

	const [visibleProjects, setVisibleProjects] = useState<number>(0);
	const [cursorPos, setCursorPos] = useState<Point | null>(null);
	const [pathPoints, setPathPoints] = useState<Point[]>([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const data = await getProjects();
			if (data) setProjects(data);
		};
		fetchProjects();
	}, []);

	// пересчёт реальных точек на пути (getPointAtLength -> точные координаты)
	const recalcPathPoints = () => {
		const path = pathRef.current;
		if (!path || projects.length === 0) return;

		const totalLength = path.getTotalLength();
		const pts: Point[] = [];
		const denom = projects.length > 1 ? projects.length - 1 : 1;

		for (let i = 0; i < projects.length; i++) {
			const fraction = i / denom;
			const p = path.getPointAtLength(totalLength * fraction);
			pts.push({ x: p.x, y: p.y });
		}
		setPathPoints(pts);
	};

	useEffect(() => {
		recalcPathPoints();
		// пересчитать при ресайзе (SVG меняет размеры)
		const onResize = () => recalcPathPoints();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projects, pathRef.current]); // перезапускать, когда путь примонтирован или projects меняются

	useEffect(() => {
		const handleScroll = () => {
			const path = pathRef.current;
			const container = containerRef.current;
			if (!path || !container) return;

			const totalLength = path.getTotalLength();
			const rect = path.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// прогресс: начинается немного раньше и кончается чуть позже для плавности
			let progress =
				(windowHeight - rect.top) / (windowHeight + rect.height - 500);
			progress = Math.max(0, Math.min(progress, 1));

			const drawLength = totalLength * progress;

			// рисуем линию
			path.style.strokeDasharray = `${totalLength}`;
			path.style.strokeDashoffset = `${totalLength - drawLength}`;

			// позиция курсора по линии
			const cursorPoint = path.getPointAtLength(drawLength);
			setCursorPos({ x: cursorPoint.x, y: cursorPoint.y });

			// видимые проекты (по длине)
			let count = 0;
			const denom = projects.length > 1 ? projects.length - 1 : 1;
			for (let i = 0; i < projects.length; i++) {
				const frac = i / denom;
				const pointDist = totalLength * frac;
				if (drawLength + 1 >= pointDist) count = i + 1; // +1 для чуть раннего открытия
			}
			setVisibleProjects(count);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, [projects]);

	// Параметры линии и генерация грубых контрольных точек (они нужны только для построения path)
	const leftX = 150;
	const rightX = 550;
	const gapY = 300;
	const offsetY = 80;
	const wave1 = 120;
	const wave2 = 10;

	const generateControlPoints = (): Point[] => {
		return projects.map((_, i) => {
			const baseX = i % 2 === 0 ? rightX : leftX;
			return {
				x:
					baseX +
					Math.sin(i * 1.3) * wave1 +
					Math.cos(i * 0.8 + Math.PI / 4) * wave2,
				y:
					i * gapY +
					offsetY +
					Math.cos(i * 0.9) * (wave1 / 2) +
					Math.sin(i * 1.5) * (wave2 / 2),
			};
		});
	};

	const controlPoints = generateControlPoints();

	const line = d3
		.line<Point>()
		.x(d => d.x)
		.y(d => d.y)
		.curve(d3.curveCatmullRom.alpha(0.6));

	const linePath = line(controlPoints) || '';

	// утилиты
	const clamp = (v: number, a: number, b: number) =>
		Math.max(a, Math.min(b, v));
	const CARD_W = 320; // ширина карточки (подстраивай под ProjectCard)
	const H_GAP = 36; // горизонтальный отступ от точки до карточки

	return (
		<div
			id='portfolio'
			ref={containerRef}
			className='relative scroll-mt-[100px]'
		>
			<h2>Мои проекты</h2>
			<svg className='absolute top-0 left-0 w-full h-full pointer-events-none z-10'>
				<defs>
					<linearGradient id='line-gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
						<stop offset='0%' stopColor='var(--primary)' />
						<stop offset='100%' stopColor='var(--primary)' />
					</linearGradient>
				</defs>

				<path
					ref={pathRef}
					d={linePath}
					stroke='url(#line-gradient)'
					strokeWidth={3}
					fill='none'
					style={{
						strokeDasharray: 0,
						strokeDashoffset: 0,
						transition: 'stroke-dashoffset 0.08s linear',
					}}
				/>

				{/* точки: используем рассчитанные pathPoints если они есть, иначе контрольные */}
				{(pathPoints.length === projects.length
					? pathPoints
					: controlPoints
				).map((p, i) => (
					<circle
						key={i}
						cx={p.x}
						cy={p.y}
						r={6}
						fill={i < visibleProjects ? 'var(--primary)' : 'transparent'}
						stroke='var(--primary)'
						strokeWidth={2}
					/>
				))}

				{/* курсор */}
				{cursorPos && (
					<motion.circle
						cx={cursorPos.x}
						cy={cursorPos.y}
						r={10}
						fill='var(--primary)'
						style={{ filter: 'drop-shadow(0 0 8px var(--primary))' }}
						animate={{
							scale: [1, 1.25, 1],
							x: [0, 2, -2, 0],
							y: [0, -1, 1, 0],
						}}
						transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
					/>
				)}
			</svg>

			{/* Абсолютно позиционированные карточки поверх SVG */}
			<div className='absolute top-0 left-0 w-full h-full z-20 pointer-events-none'>
				{(pathPoints.length === projects.length
					? pathPoints
					: controlPoints
				).map((p, i) => {
					const isVisible = i < visibleProjects;
					// логика: если точка справа (т.к. мы ставим правые базовые точки на even = rightX),
					// то карточку чаще ставим в противоположную сторону, чтобы не заходила за край
					const isPointOnRight = controlPoints[i].x >= (rightX + leftX) / 2;

					// вычисляем желаемый left для карточки
					let desiredLeft = isPointOnRight ? p.x - CARD_W - H_GAP : p.x + H_GAP;
					const containerWidth = containerRef.current?.clientWidth ?? 1200;
					desiredLeft = clamp(desiredLeft, 16, containerWidth - CARD_W - 16);

					const style: React.CSSProperties = {
						position: 'absolute',
						top: `${p.y}px`,
						left: `${desiredLeft}px`,
						transform: 'translateY(-50%)', // центрирование по вертикали относительно точки
						pointerEvents: isVisible ? 'auto' : 'none',
						zIndex: 30,
					};

					return (
						<motion.div
							key={projects[i].id}
							initial={{ opacity: 0, x: isPointOnRight ? 40 : -40 }}
							animate={
								isVisible
									? { opacity: 1, x: 0 }
									: { opacity: 0, x: isPointOnRight ? 40 : -40 }
							}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							style={style}
						>
							<div style={{ width: CARD_W }} className='pointer-events-auto'>
								<ProjectCard project={projects[i]} className='w-full' />
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* fallback content чтобы блок имел высоту */}
			<div style={{ height: (projects.length - 1) * gapY + 400 }} />
		</div>
	);
};
