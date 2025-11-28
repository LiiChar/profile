'use client';
import { BorderProgress } from "@/components/ui/border-progress";
import { cn } from "@/lib/utils";
import { useScroll } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type ScrollProgressProps = {
	targetId?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ScrollProgressBorder = ({
	targetId,
	children,
	className,
	...props
}: ScrollProgressProps) => {
	const targetRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ['start start', 'end end'],
	});

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		targetRef.current = document.getElementById(`#${targetId}`)!;
	});

	useEffect(() => {
		return scrollYProgress.on('change', setProgress);
	}, [scrollYProgress]);

	return (
		<BorderProgress
			strokeColor='#ffffff' // красный акцент
			strokeWidth={3}
			progress={progress}
			className={cn('rounded-2xl', className)}
			{...props}
		>
			{children}
		</BorderProgress>
	);
};
