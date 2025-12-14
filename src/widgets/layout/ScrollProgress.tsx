'use client';
import { BorderProgress } from "@/components/ui/border-progress";
import { cn } from "@/lib/utils";
import { useScroll } from "framer-motion";
import { useEffect, useState, useRef, useCallback, memo } from "react";

const ScrollProgressBorderComponent = memo(({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { targetId?: string }) => {
	const [progress, setProgress] = useState(0);

	const unsubscribeRef = useRef<(() => void) | null>(null);
	const animationFrameRef = useRef<number>(null);

	const handleProgressChange = useCallback((latest: number) => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		animationFrameRef.current = requestAnimationFrame(() => {
			setProgress(latest);
		});
	}, []);

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
			strokeColor='#ffffff' // красный акцент
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
