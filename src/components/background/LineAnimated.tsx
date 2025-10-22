'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type Point = { x: number; y: number };

type D3LineAnimatedProps = {
	view?: true;
	points?: Point[];
};

export default function LineAnimated({ points: p = [] }: D3LineAnimatedProps) {
	const pathRef = useRef<SVGPathElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [pathLength, setPathLength] = useState(0);
	const [points] = useState<Point[]>(p);
	const [scrollProgress, setScrollProgress] = useState(0);

	const lineGenerator = d3
		.line<Point>()
		.x((d) => d.x)
		.y((d) => d.y)
		.curve(d3.curveBasis);

	const pathData = lineGenerator(points);

	// Получаем длину пути
	useEffect(() => {
		if (pathRef.current) {
			const length = pathRef.current.getTotalLength();
			setPathLength(length);
		}
	}, [points]);

	// Обновляем прогресс скролла
	useEffect(() => {
		const handleScroll = () => {
			if (!wrapperRef.current) return;

			const rect = wrapperRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// считаем видимую часть элемента
			const visible = 1 - Math.max(0, Math.min(1, rect.top / windowHeight));
			setScrollProgress(visible);
		};

		handleScroll(); // начальное значение
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, []);

	return (
		<div ref={wrapperRef} className='w-full h-full absolute top-0 left-0'>
			<svg className='w-full h-full'>
				<path
					ref={pathRef}
					d={pathData || ''}
					strokeWidth={2}
					className='stroke-primary/10 fill-transparent'
					style={{
						strokeDasharray: pathLength,
						strokeDashoffset: pathLength * (1 - scrollProgress),
						transition: 'stroke-dashoffset 0.1s linear',
					}}
				/>
			</svg>
		</div>
	);
}
