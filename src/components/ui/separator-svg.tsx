'use client';
import React from 'react';

interface SeparatorSvgProps {
	width?: number; // в px
	height?: number; // в px
	className?: string;
	style?: React.CSSProperties;
	thickness?: number; // толщина линии, default = 2
	radius?: number; // радиус окончания линии, default = 2
}

export const SeparatorSvg: React.FC<SeparatorSvgProps> = ({
	width = 8,
	height = 40,
	className = 'text-foreground/60',
	style,
	thickness = 2,
	radius = 2,
}) => {
	// защитим от нулевых значений
	const w = Math.max(1, Math.round(width));
	const h = Math.max(1, Math.round(height));
	const cx = w / 2;

	return (
		<svg
			width={w}
			height={h}
			viewBox={`0 0 ${w} ${h}`}
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			style={style}
			aria-hidden
			role='img'
		>
			{/* вертикальная линия с закруглёнными концами */}
			<line
				x1={cx}
				y1={radius}
				x2={cx}
				y2={h - radius}
				stroke='currentColor'
				strokeWidth={thickness}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
};

export default SeparatorSvg;
