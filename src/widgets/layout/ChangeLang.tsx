'use client';

import { usePathname, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';

const SwitchDetail = dynamic(
	() => import('@/components/ui/switch-detail.js').then(mod => mod.default),
	{
		ssr: false,
	}
);

export default function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	const currentLang = pathname.split('/')[1] || 'ru'; // если локали нет — берём дефолт

	const switchLanguage = async () => {
		const newLang = currentLang === 'ru' ? 'en' : 'ru';
    
		setCookie('lang', newLang, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
		});

		// Правильно формируем путь с новой локалью
		const newPath = pathname.startsWith(`/${currentLang}`)
			? pathname.replace(`/${currentLang}`, `/${newLang}`)
			: `/${newLang}${pathname}`;

		router.push(newPath);
	};

	return (
		<button
			onClick={switchLanguage}
			className='group'
			aria-label={`${currentLang === 'ru' ? 'Switch to English' : 'Переключить на русский'} (currently ${currentLang.toUpperCase()})`}
			type="button"
		>
			<SwitchDetail
				value={currentLang === 'ru'}
				className='w-14 h-7 text-[13px] font-semibold transition-all duration-300 group-hover:scale-110'
				variant='pill'
				first='EN'
				second='RU'
			/>
		</button>
	);
}
