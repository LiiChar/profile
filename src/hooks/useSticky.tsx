import { useEffect, useRef, useState } from 'react';

export function useSticky<T extends HTMLElement>(stickyTop: number = 0) {
	const ref = useRef<T | null>(null);
	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (!ref.current) return;
			const rect = ref.current.getBoundingClientRect();
			// sticky считается активным, если верх совпадает с top
			setIsSticky(rect.top <= stickyTop);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // вызов сразу, чтобы состояние было актуальным

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [stickyTop]);

	return { ref, isSticky };
}
