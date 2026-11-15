'use client';

import { Text } from '@/components/ui/text-client';
import { getFromDict } from '@/helpers/i18n-client';
import { useDictionary } from '@/stores/lang/langProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';

type ExperienceItem = {
	position: string;
	company: string;
	website: string;
	location: string;
	date: string;
	description: string;
	responsibilities: string[];
};

export const Experience = () => {
	const { dict } = useDictionary();
	const reduceMotion = useReducedMotion();
	const positions = getFromDict(dict, 'page.main.experience.positions') as ExperienceItem[];

	return (
		<section id='experience' className='site-section contain-layout'>
			<div className='site-container'>
				<motion.div
					initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
					className='mb-10 md:mb-14'
				>
					<p className='site-eyebrow mb-4'><Text text='page.main.experience.eyebrow' /></p>
					<h2 className='site-section-title'>
						<Text text='page.main.experience.title' />
					</h2>
					<p className='site-section-description'>
						<Text text='page.main.experience.subtitle' />
					</p>
				</motion.div>

				<div className='relative max-w-4xl'>
					<div aria-hidden='true' className='absolute bottom-5 left-[7px] top-5 w-px bg-[var(--site-border)] sm:left-[9px]' />
					<div className='space-y-8 md:space-y-10'>
						{positions.map((item, index) => (
							<motion.article
								key={item.company}
								initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-80px' }}
								transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.12 }}
								className='relative pl-8 sm:pl-12'
							>
								<span aria-hidden='true' className='absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-[var(--site-accent)] bg-[var(--site-background)] sm:left-[2px]'>
									<span className='h-1.5 w-1.5 rounded-full bg-[var(--site-accent)]' />
								</span>

								<div className='site-surface p-5 sm:p-7 md:p-8'>
									<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
										<div>
											<p className='mb-2 font-mono text-xs tracking-wide text-[var(--site-accent)]'>{item.date}</p>
											<h3 className='text-xl font-semibold tracking-tight sm:text-2xl'>{item.position}</h3>
											<a href={item.website} target='_blank' rel='noreferrer' className='group mt-1 inline-flex items-center gap-1 text-sm font-medium text-[var(--site-muted)] transition-colors hover:text-[var(--site-accent)]'>
												{item.company}
												<ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
											</a>
										</div>
										<div className='inline-flex items-center gap-1.5 text-xs text-[var(--site-subtle)]'>
											<MapPin className='h-3.5 w-3.5' />
											{item.location}
										</div>
									</div>

									<p className='mt-5 max-w-2xl text-sm leading-7 text-[var(--site-muted)] sm:text-base'>{item.description}</p>

									<ul className='mt-5 space-y-3 border-t border-[var(--site-border)] pt-5'>
										{item.responsibilities.map(responsibility => (
											<li key={responsibility} className='flex gap-3 text-sm leading-6 text-[var(--site-muted)]'>
												<span aria-hidden='true' className='mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--site-accent)]' />
												{responsibility}
											</li>
										))}
									</ul>
								</div>
							</motion.article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
