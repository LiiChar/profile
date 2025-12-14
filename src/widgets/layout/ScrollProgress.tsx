'use client';
import { BorderProgress } from "@/components/ui/border-progress";
import { cn } from "@/lib/utils";
import { useScroll } from "framer-motion";
import { useEffect, useState, useRef, useCallback, memo } from "react";

type ScrollProgressProps = {
	targetId?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ScrollProgressBorderComponent = memo(({
	targetId,
	children,
	className,
	...props
}: ScrollProgressProps) => {
	const targetRef = useRef<HTMLElement>(null);
	const [progress, setProgress] = useState(0);

	// Используем useRef для хранения подписки чтобы избежать пересоздания
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const animationFrameRef = useRef<number>(null);

	// useCallback для обработчика изменений - предотвращает пересоздание функций
	const handleProgressChange = useCallback((latest: number) => {
		// Throttling с requestAnimationFrame для лучшей производительности
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		animationFrameRef.current = requestAnimationFrame(() => {
			setProgress(latest);
		});
	}, []);

	useEffect(() => {
		if (!targetId) return;

		// Исправлена логика - убираем лишний # если он уже есть в targetId
		const elementId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
		const targetElement = document.getElementById(elementId);

		if (targetElement) {
			targetRef.current = targetElement;
		}
	}, [targetId]);

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ['start start', 'end end'],
		layoutEffect: false, // Отключаем layoutEffect для лучшей производительности
	});

	useEffect(() => {
		if (!scrollYProgress) return;

		// Очищаем предыдущую подписку
		if (unsubscribeRef.current) {
			unsubscribeRef.current();
		}

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		// Создаем новую подписку с мемоизированным обработчиком
		const unsubscribe = scrollYProgress.on('change', handleProgressChange);

		unsubscribeRef.current = unsubscribe;

		return unsubscribe;
	}, [scrollYProgress, handleProgressChange]);

	// Очистка animationFrame при размонтировании
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
			progress={progress}
			className={cn('rounded-2xl', className)}
			{...props}
		>
			{children}
		</BorderProgress>
	);
});

ScrollProgressBorderComponent.displayName = 'ScrollProgressBorderComponent';

export const ScrollProgressBorder = ScrollProgressBorderComponent;
