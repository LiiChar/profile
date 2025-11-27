'use client';

import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface BorderProgressProps extends HTMLAttributes<HTMLDivElement> {
	strokeWidth?: number;
	strokeColor?: string;
	progress?: number;
	loading?: boolean;
}

export const BorderProgress = ({
	strokeWidth = 2,
	strokeColor = 'currentColor',
	progress = 0,
	loading = false,
	className,
	children,
	...props
}: BorderProgressProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0, borderRadius: 0 });

	useEffect(() => {
		const update = () => {
			if (!containerRef.current) return;
			const el = containerRef.current;
			const rect = el.getBoundingClientRect();
			const style = getComputedStyle(el);
			const br = Math.max(parseFloat(style.borderRadius || '0'), 0);

			setSize({
				width: rect.width,
				height: rect.height,
				borderRadius: br,
			});
		};

		update();
		const observer = new ResizeObserver(update);
		if (containerRef.current) observer.observe(containerRef.current);
		window.addEventListener('resize', update);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', update);
		};
	}, []);

	const { width, height, borderRadius } = size;
	if (width === 0 || height === 0)
		return (
			<div ref={containerRef} className={className}>
				{children}
			</div>
		);

	const r = Math.min(borderRadius, width / 2, height / 2);
	const perimeter = 2 * (width + height) - 8 * r + 2 * Math.PI * r;
	const dashLength = loading
		? perimeter * 0.25
		: perimeter * Math.max(0, Math.min(1, progress));

	const pathD = `
    M ${r},0
    H ${width - r}
    Q ${width},0 ${width},${r}
    V ${height - r}
    Q ${width},${height} ${width - r},${height}
    H ${r}
    Q 0,${height} 0,${height - r}
    V ${r}
    Q 0,0 ${r},0
    Z
  `;

	return (
		<div
			ref={containerRef}
			className={cn('relative inline-block', className)}
			{...props}
		>
			{/* Контент остаётся видимым */}
			{children}

			{/* SVG-бордер поверх */}
			<svg
				className='absolute inset-0 w-full h-full pointer-events-none'
				viewBox={`0 0 ${width} ${height}`}
			>
				<path
					d={pathD}
					fill='none'
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeLinecap='round'
					strokeDasharray={`${dashLength} ${perimeter}`}
					className={cn(
						'transition-all duration-500 ease-out',
						loading && 'animate-dash'
					)}
				/>
			</svg>

			<style jsx>{`
				@keyframes dash {
					to {
						stroke-dashoffset: -${perimeter};
					}
				}
			`}</style>
		</div>
	);
};
