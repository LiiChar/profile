// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// import { Hero } from '@/widgets/main/Hero';
// import { Description } from '@/widgets/main/Description';
// import Portfolio from '@/widgets/main/Portfolio';
// import Projects from '@/widgets/main/Projects';

// gsap.registerPlugin(ScrollTrigger);

// const SECTIONS = [
// 	{ id: 'hero', Component: Hero },
// 	{ id: 'desc', Component: Description },
// 	{ id: 'portfolio', Component: Portfolio },
// 	{ id: 'projects', Component: Projects },
// ];

// export const MainWrapper = () => {
// 	const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

// 	useEffect(() => {
// 		sectionRefs.current.forEach(el => {
// 			if (!el) return;

// 			gsap.fromTo(
// 				el,
// 				{
// 					autoAlpha: 0,
// 					y: 100,
// 				},
// 				{
// 					autoAlpha: 1,
// 					y: 0,
// 					duration: 1,
// 					ease: 'power2.out',
// 					scrollTrigger: {
// 						trigger: el,
// 						start: 'top 80%',
// 						end: 'top 30%',
// 						toggleActions: 'play none none reverse',
// 					},
// 				}
// 			);
// 		});

// 		return () => {
// 			ScrollTrigger.getAll().forEach(t => t.kill());
// 		};
// 	}, []);

// 	return (
// 		<main className='bg-background font-sans space-y-48 px-6 py-12'>
// 			{SECTIONS.map(({ id, Component }, i) => (
// 				<div
// 					key={id}
// 					id={id}
// 					ref={el => {
// 						sectionRefs.current[i] = el;
// 					}}
// 					className='min-h-screen flex items-center justify-center'
// 				>
// 					<Component />
// 				</div>
// 			))}
// 		</main>
// 	);
// };
