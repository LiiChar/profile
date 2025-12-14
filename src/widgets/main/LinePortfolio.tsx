'use client';

import { getProjects } from '@/action/project/getProjects';
import { ProjectType } from '@/db/tables/project';
import { useEffect, useRef, useState } from 'react';
import { ProjectCard } from '@/components/project/ProjectCard';

const MAIN_PATH = `
	M300 40
	C180 160, 420 260, 300 380
	S180 600, 300 720
	S420 920, 300 1080
`;

const BRANCH_PATHS = [
	'M300 380 C220 420, 180 480, 160 540',
	'M300 720 C380 760, 440 820, 460 880',
];

const POINT_T = [0.12, 0.32, 0.52, 0.72, 0.9];

const CARD_W = 320;
const GAP = 56;
const OFFSET = 0.4;

export const LinePortfolio = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);

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

	useEffect(() => {
		const onScroll = () => {
			if (!containerRef.current) return;

			

			const rect = containerRef.current.getBoundingClientRect();
			const windowH = window.innerHeight;

			const start = windowH * 0.85;
			const end = -rect.height * 0.15;

			const p = (start - rect.top) / (start - end) - OFFSET;
			setProgress(Math.min(1, Math.max(0, p)));
		};

		window.addEventListener('scroll', onScroll);
		onScroll();

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const drawnLength = totalLength * progress;

	const mobilePoints = POINT_T.map((_, i) => ({ x: 50, y: 200 + i * 250 }));

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
				<h2 className='mb-24 text-center'>Мои проекты</h2>

				{/* Мобильная линия */}
				<div className='absolute left-10 top-24'>
					<svg
						width={12}
						height={mobilePoints[mobilePoints.length - 1].y + 100}
						viewBox={`0 0 12 ${mobilePoints[mobilePoints.length - 1].y + 100}`}
					>
						<line
							x1={6}
							y1={0}
							x2={6}
							y2={mobilePoints[mobilePoints.length - 1].y + 50}
							stroke='var(--primary)'
							strokeWidth={4}
							strokeDasharray={mobilePoints[mobilePoints.length - 1].y + 50}
							strokeDashoffset={
								(mobilePoints[mobilePoints.length - 1].y + 50) * (1 - progress)
							}
							style={{ transition: 'stroke-dashoffset 0.08s linear' }}
						/>
						{mobilePoints.map((p, i) => {
							const active = progress >= i / (mobilePoints.length - 1);
							return (
								<circle
									key={i}
									cx={6}
									cy={p.y - 50}
									r={5}
									fill={active ? 'var(--primary)' : 'transparent'}
									stroke='var(--primary)'
									strokeWidth={2}
									style={{ transition: 'fill 0.3s ease' }}
								/>
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
							style={{
								position: 'absolute',
								top: p.y,
								left: '80px',
								width: `calc(100vw - 100px)`,
								maxWidth: '400px',
								transform: 'translateY(-50%)',
								opacity: active ? 1 : 0,
								pointerEvents: active ? 'auto' : 'none',
								transition: 'opacity 0.4s ease',
								zIndex: 10,
							}}
						>
							<ProjectCard className='' project={projects[i]} />
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
			style={{ height: 1200 }}
		>
			<h2 className='mb-24 text-center'>Мои проекты</h2>

			<svg
				className='absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none'
				width={600}
				height={1100}
				viewBox='0 0 600 1100'
			>
				{/* Основная линия */}
				<path
					ref={pathRef}
					d={MAIN_PATH}
					fill='none'
					stroke='var(--primary)'
					strokeWidth={3}
					strokeDasharray={totalLength}
					strokeDashoffset={totalLength - drawnLength}
					style={{ transition: 'stroke-dashoffset 0.08s linear' }}
				/>

				{/* Ответвления */}
				{BRANCH_PATHS.map((d, i) => (
					<path
						key={i}
						d={d}
						fill='none'
						stroke='var(--primary)'
						strokeOpacity={0.35}
						strokeWidth={2}
					/>
				))}

				{/* Точки строго на линии */}
				{points.map((p, i) => {
					const active = drawnLength >= POINT_T[i] * totalLength;

					return (
						<circle
							key={i}
							cx={p.x}
							cy={p.y}
							r={7}
							fill={active ? 'var(--primary)' : 'transparent'}
							stroke='var(--primary)'
							strokeWidth={2}
							style={{ transition: 'fill 0.3s ease' }}
						/>
					);
				})}
			</svg>

			{/* Карточки */}
			{points.map((p, i) => {
				if (!projects[i]) return null;

				const active = drawnLength >= POINT_T[i] * totalLength;
				const left =
					i % 2 === 0
						? `calc(50% - ${CARD_W + GAP}px)`
						: `calc(50% + ${GAP}px)`;

				return (
					<div
						key={projects[i].id}
						style={{
							position: 'absolute',
							top: p.y + 50,
							left,
							width: CARD_W,
							transform: 'translateY(-50%)',
							opacity: active ? 1 : 0,
							pointerEvents: active ? 'auto' : 'none',
							transition: 'opacity 0.4s ease',
							zIndex: 10,
						}}
					>
						<ProjectCard project={projects[i]} />
					</div>
				);
			})}
		</div>
	);
};
