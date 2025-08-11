'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { DialogZoom } from '@/components/ui/dialog-zoom';
import { Text } from '@/components/ui/text-client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Autoscroll from 'embla-carousel-auto-scroll';
import AutoHeight from 'embla-carousel-auto-height';

export default function Portfolio() {
	return (
		<section className=''>
			<h2 className='mb-8'>
				<Text text='page.main.portfolio.title' />
			</h2>
			<div className='flex gap-3 w-full'>
				<PortfolioView portfolio={PortfolioItihas} />
				<PortfolioView direction='backward' portfolio={PortfolioItihas} />
				<PortfolioView portfolio={PortfolioItihas} />
			</div>
		</section>
	);
}

type PortfolioItem = {
	id: number;
	title: string;
	description?: string;
	linkDevelop?: string;
	linkGitHub?: string;
	image: string;
};

const PortfolioItihas: PortfolioItem[] = [
	{ id: 0, title: 'Itihas', image: '/media/porftolio/itihas/1.png' },
	{ id: 1, title: 'Filing', image: '/media/porftolio/filing/1.png' },
	{ id: 2, title: 'BookStyde', image: '/media/porftolio/bookstyde/1.png' },
	{ id: 3, title: 'Itihas', image: '/media/porftolio/itihas/1.png' },
	{ id: 4, title: 'Filing', image: '/media/porftolio/filing/1.png' },
	{ id: 5, title: 'BookStyde', image: '/media/porftolio/bookstyde/1.png' },
	{ id: 6, title: 'Itihas', image: '/media/porftolio/itihas/1.png' },
	{ id: 7, title: 'Filing', image: '/media/porftolio/filing/1.png' },
	{ id: 8, title: 'BookStyde', image: '/media/porftolio/bookstyde/1.png' },
	{ id: 9, title: 'Itihas', image: '/media/porftolio/itihas/1.png' },
	{ id: 10, title: 'Filing', image: '/media/porftolio/filing/1.png' },
	{ id: 11, title: 'BookStyde', image: '/media/porftolio/bookstyde/1.png' },
	{ id: 12, title: 'Itihas', image: '/media/porftolio/itihas/1.png' },
];

export const PortfolioView = ({
	portfolio,
	direction = 'forward',
}: {
	portfolio: PortfolioItem[];
	direction?: 'forward' | 'backward';
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			// scrollRef.current.scrollTop = 0;
		}
	}, [scrollRef]);

	return (
		<div className='w-1/3 h-[500px] overflow-y-hidden rounded-lg  scroll-smooth'>
			<Carousel
				plugins={[
					Autoscroll({
						speed: 0.5,
						direction,
						startDelay: 2000,
						playOnInit: true,
						stopOnMouseEnter: false,
						stopOnFocusIn: false,
						stopOnInteraction: false,
					}),
					AutoHeight(),
				]}
				opts={{
					align: 'start',
					dragFree: true,
					loop: true,
				}}
				orientation='vertical'
			>
				<CarouselContent className='gap-3 h-[600px]'>
					{portfolio.map(p => (
						<CarouselItem
							key={p.id}
							className='relative group w-full p-0 basis-[calc(33%-34px)] first:mt-3 aspect-[16/9] rounded-lg overflow-hidden'
						>
							<DialogZoom
								className='min-w-[80vw] bg-transparent border-none p-0'
								title={p.title}
								trigger={
									<div className='relative w-full h-full group'>
										<Image
											fill
											src={p.image}
											alt={p.title}
											className='object-cover rounded-lg group-hover:scale-110 duration-500'
										/>

										{/* Подложка с текстом */}
										<div className='absolute group-hover:bottom-0 -bottom-12 transition-all left-0 w-full'>
											<div className='bg-gradient-to-t from-black/70 to-transparent px-2 py-2'>
												<p className='text-white mb-3 text-sm font-medium text-center shadow-md'>
													{p.title}
												</p>
											</div>
										</div>
									</div>
								}
							>
								<div className=' w-full h-full relative rounded-sm overflow-hidden'>
									<Image
										fill
										src={p.image}
										alt={p.title}
										className='object-contain static!'
									/>
								</div>
							</DialogZoom>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};
