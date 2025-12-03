'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Monitor, FileText, LayoutDashboard, Book, Brain } from 'lucide-react';

const MainComponents = {
	hero: { title: 'Главная', icon: <Monitor className='w-5 h-5' /> },
	description: { title: 'Обо мне', icon: <FileText className='w-5 h-5' /> },
	knowledge: { title: 'Навыки', icon: <Brain className='w-5 h-5' /> },
	portfolio: {
		title: 'Портфолио',
		icon: <LayoutDashboard className='w-5 h-5' />,
	},
	blog: { title: 'Блог', icon: <Book className='w-5 h-5' /> },
} as const;

type Components = typeof MainComponents;
type ComponentKey = keyof Components;

type NavigationProps = {
	components?: Partial<Components>;
};

export const Navigation = ({
	children,
	components = MainComponents,
}: React.PropsWithChildren<NavigationProps>) => {
	const [currentSection, setCurrentSection] = useState<string>('hero');
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				let best: any = null;

				entries.forEach(entry => {
					if (entry.isIntersecting) {
						if (!best || entry.intersectionRatio > best.intersectionRatio) {
							best = entry;
						}
					}
				});

				if (best) {
					setCurrentSection(best.target.id);
				}
			},
			{ rootMargin: '-20% 0px -80% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
		);

		Object.keys(components).forEach(key => {
			const el = document.getElementById(key);
			if (el) {
				sectionRefs.current[key] = el;
				observer.observe(el);
			}
		});

		return () => observer.disconnect();
	}, [components]);

	const scrollToSection = (id: ComponentKey) => {
		sectionRefs.current[id]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	return (
		<>
			{children}

			<nav className='fixed top-1/2 w-12 z-[100] -translate-y-1/2 right-6 min-[980px]:flex hidden min-[980px]:right-[calc(25%-238px)] group gap-2 flex-col'>
				<div className='relative flex flex-col gap-0 bg-background/70 backdrop-blur-lg rounded-full border border-border shadow-2xl'>
					<motion.div
						layoutId='sidebar-marker'
						className='absolute inset-0 -z-10 rounded-full bg-secondary/10 backdrop-blur-md border border-foreground'
						transition={{ type: 'spring', stiffness: 400, damping: 35 }}
					/>

					{Object.entries(components).map(([key, { title, icon }]) => {
						const isActive = currentSection === key;

						return (
							<div key={key} className='relative group'>
								<div className='absolute right-full top-1/2 -translate-y-1/2 ml-4 opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:-translate-x-2 transition-all duration-300 whitespace-nowrap'>
									<span
										className={cn(
											'text-sm font-medium',
											isActive ? 'text-primary' : 'text-foreground'
										)}
									>
										{title}
									</span>
								</div>
								{/* Кнопка */}
								<button
									onClick={() => scrollToSection(key as ComponentKey)}
									aria-current={isActive ? 'true' : 'false'}
									aria-label={`Перейти к разделу ${title}`}
									className={cn(
										'relative z-10 p-3 w-full translate-x-[1px] rounded-full transition-all duration-300',
										isActive
											? 'text-primary scale-110'
											: 'text-muted-foreground hover:text-primary hover:scale-105'
									)}
								>
									{icon}
								</button>
							</div>
						);
					})}
				</div>
			</nav>
		</>
	);
};
