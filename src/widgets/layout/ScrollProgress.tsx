'use client';
import { BorderProgress } from "@/components/ui/border-progress";
import { cn } from "@/lib/utils";
import { useScroll } from "framer-motion";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ScrollProgressBorderComponent = memo(({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { targetid?: string }) => {
	const [progress, setProgress] = useState(0);
	const reduceMotion = useReducedMotion();

	const unsubscribeRef = useRef<(() => void) | null>(null);
	const animationFrameRef = useRef<number>(null);
	const lastUpdateRef = useRef<number>(0);

	const handleProgressChange = useCallback((latest: number) => {
		const now = Date.now();
		// Throttle updates - more aggressive on reduced motion
		const throttleTime = reduceMotion ? 100 : 16;
		
		if (now - lastUpdateRef.current < throttleTime) {
			return;
		}

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		animationFrameRef.current = requestAnimationFrame(() => {
			setProgress(latest);
			lastUpdateRef.current = now;
		});
	}, [reduceMotion]);

	const { scrollYProgress } = useScroll({
		offset: ['start start', 'end end'],
		layoutEffect: false,
	});

	useEffect(() => {
		if (!scrollYProgress) return;

		if (unsubscribeRef.current) {
			unsubscribeRef.current();
		}

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		const unsubscribe = scrollYProgress.on('change', handleProgressChange);

		unsubscribeRef.current = unsubscribe;

		return unsubscribe;
	}, [scrollYProgress, handleProgressChange]);

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);
	
	return (
		<BorderProgress
			strokeColor='#ffffff'
			strokeWidth={2}
			progress={progress + 0.0005}
			className={cn('rounded-2xl', className)}
			{...props}
		>
			{children}
		</BorderProgress>
	);
});

ScrollProgressBorderComponent.displayName = 'ScrollProgressBorderComponent';

export const ScrollProgressBorder = ScrollProgressBorderComponent;
