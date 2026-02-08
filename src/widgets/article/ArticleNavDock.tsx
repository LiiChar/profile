'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Portal from '@/components/ui/portal';
import ArticleNav from '@/widgets/article/ArticleNavWrapper';

type ArticleNavDockProps = {
	targetSelect: string;
	alignSelect?: string;
	top?: number;
	offsetRight?: number;
	className?: string;
	containerClassName?: string;
};

const DEFAULT_TOP = 110;
const DEFAULT_OFFSET = -2;

export default function ArticleNavDock({
	targetSelect,
	alignSelect,
	top = DEFAULT_TOP,
	offsetRight = DEFAULT_OFFSET,
	className,
	containerClassName,
}: ArticleNavDockProps) {
	const [right, setRight] = useState(0);
	const alignSelector = alignSelect ?? targetSelect;

	useEffect(() => {
		let rafId = 0;
		let element: HTMLElement | null = null;
		let attempts = 0;

		const resolveElement = () => {
			if (!element) {
				element = document.querySelector(alignSelector) as HTMLElement | null;
			}
			return element;
		};

		const update = () => {
			const el = resolveElement();
			if (!el) {
				if (attempts < 10) {
					attempts += 1;
					rafId = requestAnimationFrame(update);
				}
				return;
			}
			const rect = el.getBoundingClientRect();
			const viewportWidth = document.documentElement.clientWidth;
			const nextRight = Math.max(0, viewportWidth - rect.right + offsetRight);
			setRight(prev => (prev === nextRight ? prev : nextRight));
		};

		const schedule = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('resize', schedule);

		const el = resolveElement();
		const observer = el ? new ResizeObserver(schedule) : null;
		if (el && observer) observer.observe(el);

		return () => {
			window.removeEventListener('resize', schedule);
			if (observer) observer.disconnect();
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [alignSelector, offsetRight]);

	return (
		<Portal>
			<div
				className={cn('z-[100000000000] flex justify-end', containerClassName)}
				style={{ position: 'fixed', top, right }}
			>
				<ArticleNav className={className} targetSelect={targetSelect} />
			</div>
		</Portal>
	);
}
