import { useEffect, useRef } from 'react';

export const useFullPageScroll = () => {
	const isAnimating = useRef(false);

	useEffect(() => {
		const sections = document.querySelectorAll('[data-scroll-section]');
		let currentIndex = 0;

		const scrollToSection = (index: number) => {
			if (index < 0 || index >= sections.length) return;
			isAnimating.current = true;
			currentIndex = index;

			const el = sections[index] as HTMLElement;
			el.scrollIntoView({ behavior: 'smooth' });

			setTimeout(() => {
				isAnimating.current = false;
			}, 1000); // время блокировки (анимации)
		};

		const handleWheel = (e: WheelEvent) => {
			if (isAnimating.current) return;

			if (e.deltaY > 50) {
				scrollToSection(currentIndex + 1);
			} else if (e.deltaY < -50) {
				scrollToSection(currentIndex - 1);
			}
		};

		window.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			window.removeEventListener('wheel', handleWheel);
		};
	}, []);
};
