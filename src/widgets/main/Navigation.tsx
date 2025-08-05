'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, {ReactNode, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
    Monitor,
    FileText,
    Hammer,
    LayoutDashboard,
} from 'lucide-react';

const MainComponents = {
    hero: {
        title: 'Главная',
        icon: <Monitor/>
    },
    description: {
        title: 'Обо мне',
        icon: <FileText />
    },
    projects: {
        title: 'Проекты',
        icon: <Hammer />
    },
    portfolio: {
        title: 'Портфолио',
        icon: <LayoutDashboard />
    },
};

type NavigationProps = {
	components?: Record<keyof typeof MainComponents, {
        title: string,
        icon: ReactNode
    }>;
};

export const Navigation = ({
	children,
	components = MainComponents,
}: React.PropsWithChildren<NavigationProps>) => {
	const [currentSection, setCurrentSection] = useState<string>('');
	const sectionRefs = useRef<Record<string, HTMLDivElement>>({});
	const buttonRefs = useRef<Record<string, HTMLButtonElement>>({});
	const containerRef = useRef<HTMLDivElement>(null);

	const [markerPos, setMarkerPos] = useState<{
		top: number;
		height: number;
	} | null>(null);

	useLayoutEffect(() => {
		if (
			currentSection &&
			buttonRefs.current[currentSection] &&
			containerRef.current
		) {
			const button = buttonRefs.current[currentSection]!;
			const container = containerRef.current!;
			const buttonRect = button.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();

			const top = buttonRect.top - containerRect.top;

			setMarkerPos({ top, height: buttonRect.height });
		}
	}, [currentSection]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				let mostVisible: IntersectionObserverEntry | null = null;

				entries.forEach(entry => {
					sectionRefs.current[entry.target.id] = entry.target as HTMLDivElement;

					if (
						entry.isIntersecting &&
						(!mostVisible ||
							entry.intersectionRatio > mostVisible.intersectionRatio)
					) {
						mostVisible = entry;
					}
				});

				if (mostVisible) {
					setCurrentSection((mostVisible as any).target.id);
				}
			},
			{ threshold: 0.2 }
		);

		Object.keys(components).forEach(key => {
			const el = document.getElementById(key);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [components]);

	const scrollToSection = (id: string) => {
		const el = sectionRefs.current[id];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<>
			{children}
			<nav
				ref={containerRef}
				className='fixed top-1/2 w-12 -translate-y-1/2 right-6 min-[980px]:flex hidden min-[980px]:right-[calc(25%-238px)] group gap-2 flex-col'
			>
				{/* Анимированный маркер */}
				{markerPos && (
					<motion.div
						layout
						initial={false}
						animate={{
							top: markerPos.top,
							height: markerPos.height,
						}}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
						className='absolute left-0 right-0 bg-primary/10 rounded-full border border-primary z-0'
					/>
				)}

				{Object.entries(components).map(([key, value]) => (
                    <div key={key} onClick={() => scrollToSection(key)} className={'w-[48px] cursor-pointer text-end relative flex items-center justify-center'}>
                        <div className={cn('absolute  w-[90px]  opacity-0 group-hover:opacity-100 group-hover:-translate-x-[calc(100%-10px)] transition-all text-nowrap', currentSection === key && 'text-primary ')}>{value.title}</div>
					    <button
					    	ref={el => (buttonRefs.current[key] = el as any) as any}
					    	className={cn(
					    		'relative z-10 rounded-full  text-foreground/50 hover:text-primary transition-colors duration-200',
					    		currentSection === key && 'text-primary font-bold p-3'
					    	)}

					    >
					    	{value.icon}
					    </button>
                    </div>
				))}
			</nav>
		</>
	);
};
