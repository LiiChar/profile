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
const OFFSET = 0.2;

export const LinePortfolio = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);

	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [progress, setProgress] = useState(0);
	const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
	const [totalLength, setTotalLength] = useState(1);

	useEffect(() => {
		getProjects().then(data => setProjects(data.slice(0, 5)));
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
