'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

type ArticleNavProps = {
	targetSelect: string;
	heading?: string;
	deep?: number;
} & React.HTMLAttributes<HTMLDivElement>;

type ArticleNav = {
	id: string;
	title: string;
	level: number;
	height: number;
	children: ArticleNav[];
	element: HTMLElement | null;
};

const getHeaders = (root: Element): ArticleNav[] => {
	const headers: ArticleNav[] = [];
	const headerElements = Array.from(
		root.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6')
	);

	if (headerElements.length === 0) return [];

	const stack: ArticleNav[] = [];

	headerElements.forEach((header, i) => {
		if (!header.id) {
			header.id = header.textContent?.trim() || Date.now().toString();
		}

		const level = Number(header.tagName.slice(1));

		const nextHeader = headerElements[i + 1];

		// Считаем "вес" секции — расстояние до следующего заголовка того же или более высокого уровня
		let sectionEnd = nextHeader;
		if (sectionEnd) {
			let temp = sectionEnd;
			while (temp && Number(temp.tagName.slice(1)) > level) {
				temp =
					headerElements[headerElements.indexOf(temp as HTMLElement) + 1] ||
					null;
			}
			sectionEnd = temp || document.body;
		} else {
			sectionEnd = document.body;
		}

		const height =
			sectionEnd.getBoundingClientRect().top -
			header.getBoundingClientRect().top;
		const relativeWeight = Math.log(Math.abs(height) + 100);

		const node: ArticleNav = {
			id: header.id,
			title: header.textContent?.trim() || '',
			level,
			height: relativeWeight,
			element: header,
			children: [],
		};

		while (stack.length && stack[stack.length - 1].level >= level) {
			stack.pop();
		}

		if (stack.length === 0) {
			headers.push(node);
		} else {
			stack[stack.length - 1].children.push(node);
		}
		stack.push(node);
	});
	
	return headers;
};

	const RenderTree = ({
	items,
	activeId,
	onClick,
	level = 0,
	expanded = false,
}: {
	items: ArticleNav[];
	activeId: string;
	onClick: (id: string) => (e: React.MouseEvent) => void;
	level?: number;
	expanded?: boolean;
}) => {
	return (
		<div>
			{items.map(item => (
				<div key={item.id} id={`nav-${item.id.replace(/"/g, '')}`}>
					<a
						href={`#${item.id}`}
						onClick={onClick(item.id)}
						className={cn(
							'!hidden group-hover:!block text-sm line-clamp-1 leading-tight text-foreground/60 hover:text-foreground transition-colors ease-in-bounce duration-150 xl:pl-2 xl:border-l-2 max-xl:pr-2 max-xl:border-r-2 border-transparent py-[2px] no-underline hover:scale-y-105',
							item.id === activeId && 'text-foreground font-medium'
						)}
						style={{ paddingLeft: `${level * 10 + 8}px` }}
					>
						{item.title}
					</a>
					<a
						href={`#${item.id}`}
						onClick={onClick(item.id)}
						className={cn(
							'!flex group-hover:!hidden text-sm line-clamp-1 leading-tight text-foreground/60 hover:text-foreground transition-colors duration-150  xl:pl-2  xl:border-l-2 max-xl:pr-2 max-xl:border-r-2 border-transparent py-[2px]	max-xl:justify-end',
							item.id === activeId && 'text-foreground font-medium'
						)}
					>
						<Separator
							style={{
								width: `${level - level * 4 + 12}px`,
								height: `${item.height - item.height * 0.7}px`,
							}}
						/>
					</a>
					{item.children.length > 0 && (
						<RenderTree
							items={item.children}
							activeId={activeId}
							onClick={onClick}
							level={level + 1}
							expanded={expanded}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default function ArticleNav({ targetSelect, ...attr }: ArticleNavProps) {
	const [articles, setArticles] = useState<ArticleNav[]>([]);
	const [activeId, setActiveId] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
	const headersRef = useRef<HTMLElement[]>([]);
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const rootNode = document.querySelector(targetSelect);
		if (!rootNode) return;

		const tree = getHeaders(rootNode);
		setArticles(tree);

		const headers = Array.from(
			rootNode.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6')
		).filter(h => h.id);
		headersRef.current = headers;

		const updateActiveHeader = () => {
			let closest: HTMLElement | null = null;
			let minDistance = Infinity;

			headers.forEach(header => {
				const rect = header.getBoundingClientRect();
				const distance = Math.abs(rect.top);

				// Учитываем только заголовки выше или чуть ниже верха экрана
				if (rect.top <= window.innerHeight * 0.3 && distance < minDistance) {
					minDistance = distance;
					closest = header;
				}
			});

			// Если ничего не найдено выше центра — берём первый видимый
			if (!closest) {
				for (const header of headers) {
					const rect = header.getBoundingClientRect();
					if (rect.top >= 0 && rect.top < window.innerHeight) {
						closest = header;
						break;
					}
				}
			}

			if (closest && closest.id !== activeId) {
				setActiveId(closest.id);
			}
		};

		// Начальное обновление
		updateActiveHeader();

		// Отслеживаем скролл с дебаунсом
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateActiveHeader();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', updateActiveHeader);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateActiveHeader);
		};
	}, [targetSelect, activeId]);

	useLayoutEffect(() => {
		if (!activeId || !navRef.current) return;

		const navEl = navRef.current;
		const activeEl = navEl.querySelector(`#${CSS.escape(`nav-${activeId.replace(/"/g, '')}`)}`) as HTMLElement;

		if (activeEl) {
			const navRect = navEl.getBoundingClientRect();
			const activeRect = activeEl.getBoundingClientRect();
			const top = activeRect.top - navRect.top;
			const height = activeRect.height;
			setIndicatorStyle({ top, height });
		}
	}, [activeId, expanded, articles]);

	const handleClick = (id: string) => (e: React.MouseEvent) => {
		e.preventDefault();
		const el = document.getElementById(id);
		if (!el) return;

		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		history.replaceState(null, '', `#${id}`);
		setActiveId(id);
	};

	return (
		<aside
			{...attr}
			className={cn('max-w-64 overflow-auto shrink-0', attr.className)}
		>
			{/* {activeId && !expanded && <div className='pl-2 pb-2 text-sm'>{activeId}</div>} */}
			<nav
				ref={navRef}
				className={cn(
					'relative xl:border-l scrollbar-transparent overflow-hidden max-h-[70vh]  max-xl:border-r border-foreground/20 group',
					expanded &&
						'max-xl:bg-background/60 max-xl:py-2 max-xl:rounded-md max-xl:backdrop-blur-lg'
				)}
				onMouseEnter={() => setExpanded(true)}
				onMouseLeave={() => setExpanded(false)}
			>
				{articles.length > 0 ? (
					<RenderTree
						items={articles}
						activeId={activeId}
						onClick={handleClick}
						expanded={expanded}
					/>
				) : (
					<p className='text-sm text-muted-foreground pl-4'>Нет заголовков</p>
				)}
				<motion.div
					className='absolute bg-primary rounded-full max-xl:right-[-1px] xl:left-[-1px]'
					style={{ width: '3px' }}
					animate={{ top: indicatorStyle.top, height: indicatorStyle.height }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				/>
			</nav>
		</aside>
	);
}
