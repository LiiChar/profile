'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
	SiCss,
	SiHtml5,
	SiLaravel,
	SiNestjs,
	SiNextdotjs,
	SiNodedotjs,
	SiPhp,
	SiReact,
	SiSqlite,
	SiTypescript,
} from '@icons-pack/react-simple-icons';
import AutoScroll from 'embla-carousel-auto-scroll';
import React, { ReactNode } from 'react';

type Knowledge = {
	icon: ReactNode;
	title: string;
	link: string;
	color: string;
};

const KnowledgeData: Knowledge[] = [
	{
		icon: <SiReact color='#0fdbfe' size={60} />,
		title: 'React',
		link: '',
		color: '#0fdbfe',
	},
	{
		icon: <SiHtml5 color='#e75833' size={60} />,
		title: 'HTML',
		link: '',
		color: '#e75833',
	},
	{
		icon: <SiCss color='#2b6cb5' size={60} />,
		title: 'CSS',
		link: '',
		color: '#2b6cb5',
	},
	{
		icon: <SiTypescript color='#1082cf' size={60} />,
		title: 'Typescript',
		link: '',
		color: '#1082cf',
	},
	{
		icon: <SiNodedotjs color='#95ca56' size={60} />,
		title: 'Node',
		link: '',
		color: '#95ca56',
	},
	{
		icon: <SiPhp color='#9199c1' size={60} />,
		title: 'PHP',
		link: '',
		color: '#9199c1',
	},
	{
		icon: <SiLaravel color='#f13e39' size={60} />,
		title: 'Laravel',
		link: '',
		color: '#f13e39',
	},
	{
		icon: <SiSqlite color='#4ba5dc' size={60} />,
		title: 'Sqlite',
		link: '',
		color: '#4ba5dc',
	},
	{
		icon: <SiNestjs color='#eb354e' size={60} />,
		title: 'Nest',
		link: '',
		color: '#eb354e',
	},
	{
		icon: <SiNextdotjs color='var(--foreground)' size={60} />,
		title: 'Next',
		link: '',
		color: 'var(--foreground)',
	},
];

export const Knowledge = () => {
	return (
		<div>
			<h2 className='mb-10'>Мои навыки</h2>
			<Carousel
				plugins={[
					AutoScroll({
						speed: 0.5,
						startDelay: 2000,
						playOnInit: true,
						stopOnMouseEnter: false,
						stopOnFocusIn: false,
						stopOnInteraction: false,
					}),
				]}
				opts={{
					align: 'start',
					dragFree: true,
					loop: true,
				}}
				orientation='horizontal'
			>
				<CarouselContent className=' h-[100px]'>
					{KnowledgeData.map(k => (
						<CarouselItem
							title={k.title}
							key={k.title}
							className='w-min basis-[15%]  pt-2 flex justify-center group relative'
						>
							{k.icon}
							<div
								className={cn(
									'absolute bottom-10 scale-50 group-hover:scale-100 opacity-0 group-hover:bottom-0 transition-all group-hover:opacity-100'
								)}
								style={{ color: k.color }}
							>
								{k.title}
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};
